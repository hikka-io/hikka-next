import { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { Value } from 'platejs';
import { createPlateEditor, Plate, PlateContent } from 'platejs/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ImageGroupKit } from '../editor/plugins/image-group-kit';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const image = (url: string) => ({
    type: 'image',
    url,
    children: [{ text: '' }],
});

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
});

async function mount(urls: string[]) {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const editor = createPlateEditor({
        plugins: ImageGroupKit,
        value: [{ type: 'image_group', children: urls.map(image) }] as Value,
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

    const buttons = (label: string) => [
        ...container.querySelectorAll<HTMLButtonElement>(
            `[aria-label="${label}"]`,
        ),
    ];
    const order = () =>
        editor.children[0].children.map(
            (node) => (node as { url?: string }).url,
        );

    return { buttons, order };
}

describe('image reordering', () => {
    it('moves an image one place later or earlier', async () => {
        const { buttons, order } = await mount(['a', 'b', 'c']);

        await act(async () => buttons('Перемістити пізніше')[0].click());
        expect(order()).toEqual(['b', 'a', 'c']);

        await act(async () => buttons('Перемістити раніше')[2].click());
        expect(order()).toEqual(['b', 'c', 'a']);
    });

    it('keeps track of an image across several moves', async () => {
        const { buttons, order } = await mount(['a', 'b', 'c', 'd']);
        const later = (index: number) =>
            act(async () => buttons('Перемістити пізніше')[index].click());

        await later(0);
        expect(order()).toEqual(['b', 'a', 'c', 'd']);
        await later(1);
        expect(order()).toEqual(['b', 'c', 'a', 'd']);
        await later(2);
        expect(order()).toEqual(['b', 'c', 'd', 'a']);
        expect(buttons('Перемістити пізніше')[3].disabled).toBe(true);
        expect(buttons('Перемістити раніше')[0].disabled).toBe(true);
    });

    it('cannot move past the ends of the group', async () => {
        const { buttons } = await mount(['a', 'b']);

        expect(buttons('Перемістити раніше')[0].disabled).toBe(true);
        expect(buttons('Перемістити пізніше')[1].disabled).toBe(true);
    });

    it('offers no moves for a single image', async () => {
        const { buttons } = await mount(['a']);

        expect(buttons('Перемістити раніше')).toHaveLength(0);
    });
});
