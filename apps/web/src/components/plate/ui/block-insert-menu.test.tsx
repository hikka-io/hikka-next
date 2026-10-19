import { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { Value } from 'platejs';
import { createPlateEditor, Plate, PlateContent } from 'platejs/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { BasicBlocksKit } from '../editor/plugins/basic-blocks-kit';
import { DndKit } from '../editor/plugins/dnd-kit';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
    // cmdk keeps the active item in view; jsdom has no layout.
    Element.prototype.scrollIntoView = () => {};
});

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
    const editor = createPlateEditor({
        plugins: [...BasicBlocksKit, ...DndKit],
        value,
    });

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

    const plusOf = (index: number) =>
        container.querySelectorAll<HTMLButtonElement>(
            '[aria-label="Додати блок"]',
        )[index];
    const types = () =>
        (editor.children as { type: string }[]).map((node) => node.type);

    return { editor, plusOf, types };
}

const pick = async (label: string) => {
    const item = [
        ...document.querySelectorAll<HTMLElement>('[cmdk-item]'),
    ].find((node) => node.textContent?.includes(label));
    await act(async () => item?.click());
};

describe('block "+" menu', () => {
    it('offers a block for an empty line in its place', async () => {
        const { plusOf, types } = await mount([
            { type: 'p', children: [{ text: '' }] },
        ]);

        await act(async () => plusOf(0).click());
        expect(document.querySelector('[cmdk-input]')).not.toBeNull();

        await pick('Цитата');

        expect(types()[0]).toBe('blockquote');
    });

    it('adds a new line below a line with text', async () => {
        const { plusOf, types, editor } = await mount([
            { type: 'p', children: [{ text: 'Текст' }] },
        ]);

        await act(async () => plusOf(0).click());

        expect(types()).toEqual(['p', 'p']);
        expect(editor.api.string([0])).toBe('Текст');
        expect(editor.selection?.anchor.path).toEqual([1, 0]);
    });

    it('does not type a "/" into the document', async () => {
        const { plusOf, editor } = await mount([
            { type: 'p', children: [{ text: '' }] },
        ]);

        await act(async () => plusOf(0).click());

        expect(editor.api.string([])).toBe('');
    });
});
