import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LoginForm from './login-form';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const { mutationFn, handleAuthSuccess, push, resetCaptcha } = vi.hoisted(
    () => ({
        mutationFn: vi.fn(async (_request: unknown) => ({ secret: 'secret' })),
        handleAuthSuccess: vi.fn(async () => {}),
        push: vi.fn(),
        resetCaptcha: vi.fn(),
    }),
);

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    loginMutation: () => ({ mutationFn }),
}));
vi.mock('@/utils/navigation', () => ({
    Link: ({ children }: { children?: ReactNode }) => (
        <a href="/reset">{children}</a>
    ),
    useRouter: () => ({ push }),
    useRouteSearch: () => ({}),
}));
vi.mock('./captcha', () => ({ default: () => null }));
vi.mock('./google-login', () => ({ default: () => null }));
vi.mock('./handle-auth-success', () => ({ handleAuthSuccess }));
vi.mock('./use-captcha', () => ({
    useCaptcha: () => ({
        captchaRef: { current: undefined },
        getToken: () => 'captcha-token',
        reset: resetCaptcha,
    }),
}));

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.clearAllMocks();
});

function must<T>(value: T | null | undefined, what: string): T {
    if (value == null) throw new Error(`missing ${what}`);

    return value;
}

async function mount() {
    const queryClient = new QueryClient();
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <LoginForm />
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const input = (name: string) =>
        must(container.querySelector<HTMLInputElement>(`#${name}`), name);
    const fieldOf = (name: string) =>
        must(input(name).closest('[data-slot="field"]'), `${name} field`);
    const errorOf = (name: string) =>
        fieldOf(name).querySelector('[role="alert"]')?.textContent ?? null;
    const submit = async () => {
        await act(async () => {
            must(container.querySelector('form'), 'form').dispatchEvent(
                new Event('submit', { bubbles: true, cancelable: true }),
            );
        });
    };

    return { input, fieldOf, errorOf, submit };
}

// React tracks the last value it rendered; going through the native setter
// is what makes the synthetic onChange fire, as it does for real typing.
async function type(input: HTMLInputElement, value: string) {
    const setValue = must(
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
            ?.set,
        'value setter',
    );

    await act(async () => {
        input.focus();
        setValue.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

async function leave(input: HTMLInputElement) {
    await act(async () => input.blur());
}

describe('login form', () => {
    it('keeps the inputs password managers read', async () => {
        const { input } = await mount();

        expect(input('identifier').type).toBe('text');
        expect(input('identifier').getAttribute('autocomplete')).toBeNull();
        expect(input('password').type).toBe('password');
        expect(input('password').getAttribute('autocomplete')).toBeNull();
    });

    it('shows a field error once the user leaves the field', async () => {
        const { input, fieldOf, errorOf } = await mount();

        await type(input('password'), 'short');
        expect(errorOf('password')).toBeNull();

        await leave(input('password'));
        expect(errorOf('password')).toBe('Щонайменше 8 символів');
        expect(fieldOf('password').getAttribute('data-invalid')).toBe('true');
        expect(input('password').getAttribute('aria-invalid')).toBe('true');

        await type(input('password'), 'long enough');
        expect(errorOf('password')).toBeNull();
        expect(fieldOf('password').getAttribute('data-invalid')).toBe('false');
    });

    it('uses the shared password messages', async () => {
        const { input, errorOf } = await mount();

        await type(input('password'), 'x'.repeat(257));
        await leave(input('password'));

        expect(errorOf('password')).toBe('Не більше 256 символів');
    });

    it('flags the identifier field on blur', async () => {
        const { input, fieldOf } = await mount();

        await type(input('identifier'), 'abc');
        expect(fieldOf('identifier').getAttribute('data-invalid')).toBe(
            'false',
        );

        await leave(input('identifier'));
        expect(fieldOf('identifier').getAttribute('data-invalid')).toBe('true');
        expect(input('identifier').getAttribute('aria-invalid')).toBe('true');
    });

    it('does not send an empty form and flags every field', async () => {
        const { fieldOf, submit } = await mount();

        await submit();

        expect(mutationFn).not.toHaveBeenCalled();
        expect(fieldOf('identifier').getAttribute('data-invalid')).toBe('true');
        expect(fieldOf('password').getAttribute('data-invalid')).toBe('true');
    });

    it.each([
        ['olexh', { body: { username: 'olexh', password: 'password1' } }],
        [
            'olexh@hikka.io',
            { body: { email: 'olexh@hikka.io', password: 'password1' } },
        ],
    ])(
        'logs %j in with the same request as before',
        async (identifier, request) => {
            const { input, submit } = await mount();

            await type(input('identifier'), identifier);
            await type(input('password'), 'password1');
            await submit();

            expect(mutationFn).toHaveBeenCalledTimes(1);
            expect(mutationFn.mock.calls[0][0]).toEqual({
                ...request,
                headers: { captcha: 'captcha-token' },
            });
            expect(handleAuthSuccess).toHaveBeenCalledWith(
                'secret',
                expect.anything(),
            );
            expect(push).toHaveBeenCalledWith('/');
        },
    );

    it('resets the captcha when the login fails', async () => {
        mutationFn.mockRejectedValueOnce(new Error('401'));
        const { input, submit } = await mount();

        await type(input('identifier'), 'olexh');
        await type(input('password'), 'password1');
        await submit();

        expect(resetCaptcha).toHaveBeenCalledTimes(1);
        expect(push).not.toHaveBeenCalled();
    });
});
