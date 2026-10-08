import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import UserNote from './user-note';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/components/markdown', () => ({
    MDViewer: ({ children }: { children: ReactNode }) => <p>{children}</p>,
}));

vi.mock('@/components/text-expand', () => ({
    default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const NOTE_MAX = API_LIMITS.listNote.max;
const THRESHOLD = NOTE_MAX - 200;

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
});

function must<T>(value: T | null | undefined, what: string): T {
    if (value == null) throw new Error(`missing ${what}`);

    return value;
}

async function mountEditing(note: string) {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(<UserNote note={note} isSaving={false} onSave={vi.fn()} />),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    await act(async () =>
        must(
            container.querySelector<HTMLButtonElement>(
                '[aria-label="Редагувати нотатку"]',
            ),
            'edit button',
        ).click(),
    );

    const textarea = must(container.querySelector('textarea'), 'textarea');
    const counter = () =>
        [...container.querySelectorAll('span')].find((span) =>
            span.textContent?.endsWith(`/${NOTE_MAX}`),
        );

    return { textarea, counter };
}

describe('UserNote editor', () => {
    it('caps the note at the backend limit', async () => {
        const { textarea } = await mountEditing('нотатка');

        expect(textarea.maxLength).toBe(NOTE_MAX);
    });

    it('hides the counter below the threshold', async () => {
        const { counter } = await mountEditing('x'.repeat(THRESHOLD - 1));

        expect(counter()).toBeUndefined();
    });

    it('shows the counter from the threshold', async () => {
        const { counter } = await mountEditing('x'.repeat(THRESHOLD));

        expect(counter()?.textContent).toBe(`${THRESHOLD}/${NOTE_MAX}`);
        expect(counter()?.className).toContain('text-right');
        expect(counter()?.className).toContain('text-muted-foreground');
    });
});
