import { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { Value } from 'platejs';
import {
    createPlateEditor,
    Plate,
    PlateContent,
    type PlateElementProps,
} from 'platejs/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BasicBlocksKit } from '../editor/plugins/basic-blocks-kit';
import { BlockInsertKit } from '../editor/plugins/block-insert-kit';
import { SlashKit } from '../editor/plugins/slash-kit';
import { SLASH_INPUT_KEY } from '../editor/plugins/trigger-keys';

const PLUGINS = [...BasicBlocksKit, ...SlashKit, ...BlockInsertKit];

// The real input cancels itself on blur, and jsdom never focuses it.
vi.mock('./slash-node', () => ({
    SlashInputElement: ({ attributes, children }: PlateElementProps) => (
        <span {...attributes}>{children}</span>
    ),
}));

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
});

async function mount(value: Value) {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const editor = createPlateEditor({ plugins: PLUGINS, value });

    await act(async () =>
        root.render(
            <Plate editor={editor}>
                <PlateContent />
            </Plate>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    return { container, editor };
}

const findButton = (container: HTMLElement) =>
    container.querySelector<HTMLButtonElement>('[aria-label="Вставити блок"]');

describe('BlockInsertButton', () => {
    it('shows only on empty top-level paragraphs', async () => {
        const { container } = await mount([
            { type: 'p', children: [{ text: 'Текст' }] },
            { type: 'blockquote', children: [{ text: '' }] },
            { type: 'p', children: [{ text: '' }] },
        ]);

        const buttons = container.querySelectorAll(
            '[aria-label="Вставити блок"]',
        );
        expect(buttons).toHaveLength(1);
        expect(buttons[0].closest('p')).toBe(
            container.querySelectorAll('p')[1],
        );
    });

    it('opens the slash menu without writing a trigger into the text', async () => {
        const { container, editor } = await mount([
            { type: 'p', children: [{ text: '' }] },
        ]);

        await act(async () => {
            findButton(container)?.click();
        });

        const [input] = editor.api.nodes({
            at: [],
            match: { type: SLASH_INPUT_KEY },
        });
        expect(input?.[0]).toMatchObject({ fromGutter: true, trigger: '/' });
        expect(editor.api.string([])).toBe('');
    });

    it('opens from the keyboard without the editor taking the key', async () => {
        const { container, editor } = await mount([
            { type: 'p', children: [{ text: '' }] },
        ]);
        const button = findButton(container);

        await act(async () => {
            const down = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true,
            });
            button?.dispatchEvent(down);
            expect(down.defaultPrevented).toBe(true);
            button?.dispatchEvent(
                new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }),
            );
        });

        expect(editor.children).toHaveLength(1);
        expect(
            editor.api.some({ at: [], match: { type: SLASH_INPUT_KEY } }),
        ).toBe(true);
    });
});
