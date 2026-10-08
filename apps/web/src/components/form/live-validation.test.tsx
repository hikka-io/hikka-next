import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { passwordSchema, usernameSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';

import { useAppForm } from './use-app-form';
import { shouldShowErrors } from './use-visible-errors';

// React only warns about act() outside a test environment it recognises.
(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const schema = z.object({
    username: usernameSchema,
    password: passwordSchema,
});

const teardown: (() => void)[] = [];

function must<T>(value: T | null | undefined, what: string): T {
    if (value == null) throw new Error(`missing ${what}`);

    return value;
}

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
});

function SignupLike({ onSubmit }: { onSubmit: () => void }) {
    const form = useAppForm({
        defaultValues: { username: '', password: '' },
        validators: { onChange: schema },
        onSubmit,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppField
                name="username"
                children={(field) => (
                    <field.TextField label="Нікнейм" description="Підказка" />
                )}
            />
            <form.AppField
                name="password"
                children={(field) => <field.PasswordField label="Пароль" />}
            />
            <button type="submit">Зареєструватись</button>
        </form>
    );
}

async function mount() {
    const onSubmit = vi.fn();
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => root.render(<SignupLike onSubmit={onSubmit} />));
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const input = (name: string) =>
        must(container.querySelector<HTMLInputElement>(`#${name}`), name);
    const errorOf = (name: string) =>
        input(name)
            .closest('[data-slot="field"]')
            ?.querySelector('[role="alert"]')?.textContent ?? null;
    const hintOf = (name: string) =>
        input(name)
            .closest('[data-slot="field"]')
            ?.querySelector('[data-slot="field-description"]')?.textContent ??
        null;

    return { container, input, errorOf, hintOf, onSubmit };
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

describe('live form validation', () => {
    it('stays quiet while the field is being filled in for the first time', async () => {
        const { input, errorOf } = await mount();

        await type(input('username'), 'ab');

        expect(errorOf('username')).toBeNull();
        expect(input('username').getAttribute('aria-invalid')).toBe('false');
    });

    it('speaks up when the user leaves the field, then follows every keystroke', async () => {
        const { input, errorOf } = await mount();

        await type(input('username'), 'ab');
        await leave(input('username'));

        expect(errorOf('username')).toBe('Щонайменше 5 символів');
        expect(input('username').getAttribute('aria-invalid')).toBe('true');

        await type(input('username'), 'abcdе'); // the last letter is Cyrillic
        expect(errorOf('username')).toBe('Недопустимий символ: «е»');

        await type(input('username'), 'abcde');
        expect(errorOf('username')).toBeNull();
        expect(input('username').getAttribute('aria-invalid')).toBe('false');
    });

    it('shows the error in place of the hint, then brings the hint back', async () => {
        const { input, errorOf, hintOf } = await mount();

        expect(hintOf('username')).toBe('Підказка');

        await type(input('username'), 'ab');
        await leave(input('username'));
        expect(hintOf('username')).toBeNull();
        expect(errorOf('username')).toBe('Щонайменше 5 символів');

        await type(input('username'), 'abcde');
        expect(errorOf('username')).toBeNull();
        expect(hintOf('username')).toBe('Підказка');
    });

    it('does not submit an invalid form and shows every problem at once', async () => {
        const { container, errorOf, onSubmit } = await mount();

        await act(async () => {
            must(container.querySelector('form'), 'form').dispatchEvent(
                new Event('submit', { bubbles: true, cancelable: true }),
            );
        });

        expect(onSubmit).not.toHaveBeenCalled();
        expect(errorOf('username')).toBe('Вкажіть нікнейм');
        expect(errorOf('password')).toBe('Щонайменше 8 символів');
    });

    it('submits once everything is valid', async () => {
        const { container, input, onSubmit } = await mount();

        await type(input('username'), 'hikka_fan');
        await type(input('password'), 'correct horse');
        await act(async () => {
            must(container.querySelector('form'), 'form').dispatchEvent(
                new Event('submit', { bubbles: true, cancelable: true }),
            );
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});

describe('password field', () => {
    it('exposes the show/hide toggle as a keyboard-reachable toggle button', async () => {
        const { input } = await mount();
        const toggle = must(
            input('password')
                .closest('div')
                ?.querySelector<HTMLButtonElement>('button'),
            'password toggle',
        );

        expect(toggle.tabIndex).toBe(0);
        expect(toggle.getAttribute('aria-label')).toBe('Показати пароль');
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
        expect(input('password').type).toBe('password');

        await act(async () => toggle.click());

        expect(input('password').type).toBe('text');
        expect(toggle.getAttribute('aria-label')).toBe('Показати пароль');
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
    });
});

describe('shouldShowErrors', () => {
    it.each([
        [false, 0, false],
        [true, 0, true],
        [false, 1, true],
    ])(
        'isBlurred=%s, submissionAttempts=%s -> %s',
        (isBlurred, submissionAttempts, shown) => {
            expect(shouldShowErrors({ isBlurred, submissionAttempts })).toBe(
                shown,
            );
        },
    );
});
