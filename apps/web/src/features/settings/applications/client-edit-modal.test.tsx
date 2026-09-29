import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ClientFullResponse, ClientResponse } from '@hikka/api';

import ClientEditModal from './client-edit-modal';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const { fullClient, updateFn } = vi.hoisted(() => ({
    fullClient: vi.fn(),
    updateFn: vi.fn(async (_request: unknown) => ({})),
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    getUserClientOptions: (options: {
        path: { client_reference: string };
    }) => ({
        queryKey: ['client', options.path.client_reference],
        queryFn: async () => fullClient(),
    }),
    updateUserClientMutation: () => ({ mutationFn: updateFn }),
    deleteUserClientMutation: () => ({ mutationFn: vi.fn() }),
}));

const REFERENCE = '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23';

const client = {
    reference: REFERENCE,
    name: 'Мій застосунок',
    description: 'Опис застосунку',
} as ClientResponse;

const withSecret = (secret: string) =>
    ({
        ...client,
        endpoint: 'https://example.com/callback',
        secret,
    }) as ClientFullResponse;

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

async function mount(full: ClientFullResponse) {
    fullClient.mockResolvedValue(full);

    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <ClientEditModal client={client} />
            </QueryClientProvider>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const input = (id: string) =>
        must(
            container.querySelector<HTMLInputElement | HTMLTextAreaElement>(
                `#${id}`,
            ),
            id,
        );

    await vi.waitFor(() => expect(input('endpoint').value).toBe(full.endpoint));

    const submit = async () => {
        await act(async () => {
            must(container.querySelector('form'), 'form').dispatchEvent(
                new Event('submit', { bubbles: true, cancelable: true }),
            );
        });
    };

    return { container, input, submit };
}

async function type(
    input: HTMLInputElement | HTMLTextAreaElement,
    value: string,
) {
    const prototype =
        input instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
    const setValue = must(
        Object.getOwnPropertyDescriptor(prototype, 'value')?.set,
        'value setter',
    );

    await act(async () => {
        input.focus();
        setValue.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

const BODY = {
    name: 'Мій застосунок',
    description: 'Опис застосунку',
    endpoint: 'https://example.com/callback',
    revoke_secret: false,
};

describe('client edit modal', () => {
    it.each([
        ['a 128 character secret', 'x'.repeat(128)],
        ['a secret of any other length', 'x'.repeat(64)],
        ['no secret', ''],
    ])('saves the editable fields with %s', async (_, secret) => {
        const { submit } = await mount(withSecret(secret));

        await submit();

        expect(updateFn).toHaveBeenCalledTimes(1);

        const request = updateFn.mock.calls[0][0] as {
            path: unknown;
            body: Record<string, unknown>;
        };

        expect(request).toEqual({
            path: { client_reference: REFERENCE },
            body: BODY,
        });
        expect(Object.keys(request.body)).toEqual(Object.keys(BODY));
    });

    it('sends the edited values', async () => {
        const { input, submit } = await mount(withSecret('x'.repeat(128)));

        await type(input('name'), 'Нова назва');
        await type(input('description'), 'Новий опис');
        await submit();

        expect(updateFn.mock.calls[0][0]).toEqual({
            path: { client_reference: REFERENCE },
            body: { ...BODY, name: 'Нова назва', description: 'Новий опис' },
        });
    });

    it('does not save an invalid editable field', async () => {
        const { input, submit } = await mount(withSecret('x'.repeat(128)));

        await type(input('name'), 'ab');
        await submit();

        expect(updateFn).not.toHaveBeenCalled();
    });

    it('shows the reference and the secret read-only', async () => {
        const secret = 'y'.repeat(64);
        const { input } = await mount(withSecret(secret));

        expect(input('reference').value).toBe(REFERENCE);
        expect(input('reference').disabled).toBe(true);
        expect(input('secret').value).toBe(secret);
        expect(input('secret').disabled).toBe(true);
        expect(input('secret').getAttribute('type')).toBe('password');
    });
});
