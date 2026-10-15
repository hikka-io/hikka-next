import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import ProfileLinkForm from './profile-link-form';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

async function mount(props: Partial<Parameters<typeof ProfileLinkForm>[0]>) {
    const onSubmit = vi.fn();
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(<ProfileLinkForm onSubmit={onSubmit} {...props} />),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    const input = (placeholder: string) =>
        must(
            container.querySelector<HTMLInputElement>(
                `input[placeholder="${placeholder}"]`,
            ),
            placeholder,
        );

    const type = (placeholder: string, value: string) =>
        act(async () => {
            const el = input(placeholder);
            Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                'value',
            )?.set?.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });

    const submit = () =>
        act(async () => {
            must(container.querySelector('form'), 'form').dispatchEvent(
                new Event('submit', { bubbles: true, cancelable: true }),
            );
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

    return { container, onSubmit, type, submit };
}

describe('ProfileLinkForm', () => {
    it('detects the service icon, trims the url and sends null for empty text', async () => {
        const { onSubmit, type, submit } = await mount({});

        await type('https://', '  https://github.com/hikka-io  ');
        await submit();

        expect(onSubmit).toHaveBeenCalledWith({
            icon: 'github',
            url: 'https://github.com/hikka-io',
            text: null,
        });
    });

    it('sends the trimmed caption when provided', async () => {
        const { onSubmit, type, submit } = await mount({});

        await type('https://', 'https://github.com/hikka-io');
        await type('Назва сервісу або домен', '  Мій код ');
        await submit();

        expect(onSubmit).toHaveBeenCalledWith({
            icon: 'github',
            url: 'https://github.com/hikka-io',
            text: 'Мій код',
        });
    });

    it('rejects a url that is already in the list', async () => {
        const { container, onSubmit, type, submit } = await mount({
            takenUrls: ['https://github.com/hikka-io'],
        });

        await type('https://', 'https://github.com/hikka-io');
        await submit();

        expect(onSubmit).not.toHaveBeenCalled();
        expect(container.textContent).toContain('Це посилання вже додано');
    });

    it('marks the caption as optional', async () => {
        const { container } = await mount({});

        expect(container.textContent).toContain("Необов'язково");
    });

    it('falls back to the custom icon for an unknown domain', async () => {
        const { onSubmit, type, submit } = await mount({});

        await type('https://', 'https://example.org/me');
        await submit();

        expect(onSubmit).toHaveBeenCalledWith({
            icon: 'custom',
            url: 'https://example.org/me',
            text: null,
        });
    });

    it.each([
        ['a url without a scheme', 'github.com/hikka-io'],
        ['a javascript: url', 'javascript:alert(1)'],
    ])('rejects %s with an error and does not submit', async (_, value) => {
        const { container, onSubmit, type, submit } = await mount({});

        await type('https://', value);
        await submit();

        expect(onSubmit).not.toHaveBeenCalled();
        expect(container.textContent).toContain(
            'Посилання має починатися з https://',
        );
    });

    it('renders the delete button only when onDelete is provided', async () => {
        const without = await mount({});
        const hasDelete = (container: HTMLElement) =>
            [...container.querySelectorAll('button')].some(
                (button) => button.textContent === 'Видалити',
            );

        expect(hasDelete(without.container)).toBe(false);

        const onDelete = vi.fn();
        const withDelete = await mount({ onDelete });
        const button = must(
            [...withDelete.container.querySelectorAll('button')].find(
                (el) => el.textContent === 'Видалити',
            ),
            'delete',
        );

        await act(async () => button.click());

        expect(onDelete).toHaveBeenCalledTimes(1);
        expect(withDelete.onSubmit).not.toHaveBeenCalled();
    });
});
