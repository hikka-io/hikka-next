import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { createPlateEditor, Plate, PlateContent } from 'platejs/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ELEMENT_VIDEO } from '../editor/plate-types';
import { VideoKit } from '../editor/plugins/video-kit';
import { VideoToolbarButton } from './video-toolbar-button';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Children = { children?: ReactNode };

vi.mock('./toolbar', () => ({
    ToolbarButton: ({ onClick }: { onClick: () => void }) => (
        <button type="button" data-toolbar onClick={onClick} />
    ),
}));

vi.mock('@/components/ui/responsive-modal', () => ({
    ResponsiveModal: ({ open, children }: Children & { open: boolean }) =>
        open ? children : null,
    ResponsiveModalContent: ({ children }: Children) => children,
    ResponsiveModalFooter: ({ children }: Children) => children,
}));

const ID = 'dQw4w9WgXcQ';

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

async function addVideo(url: string) {
    const editor = createPlateEditor({
        plugins: VideoKit,
        value: [{ type: 'p', children: [{ text: '' }] }],
    });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <Plate editor={editor}>
                <PlateContent />
                <VideoToolbarButton />
            </Plate>,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    await act(async () =>
        must(
            container.querySelector<HTMLButtonElement>('[data-toolbar]'),
            'toolbar button',
        ).click(),
    );

    const input = must(
        container.querySelector<HTMLInputElement>('#url'),
        'url input',
    );
    const setValue = must(
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
            ?.set,
        'value setter',
    );

    await act(async () => {
        setValue.call(input, url);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
        must(input.closest('form'), 'form').dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true }),
        );
    });

    const videos = (editor.children as { type: string; url?: string }[])
        .filter((node) => node.type === ELEMENT_VIDEO)
        .map((node) => node.url);
    const error =
        container.querySelector('[role="alert"]')?.textContent ?? null;

    return { videos, error };
}

describe('video toolbar button', () => {
    it.each([
        [`https://www.youtube.com/watch?v=${ID}`],
        [`https://youtu.be/${ID}?si=AbCdEf`],
        [`https://m.youtube.com/watch?v=${ID}&list=PL123`],
    ])('inserts %j as a youtube.com watch url', async (url) => {
        expect(await addVideo(url)).toEqual({
            videos: [`https://www.youtube.com/watch?v=${ID}`],
            error: null,
        });
    });

    it.each([
        [`https://www.youtube.com/shorts/${ID}`],
        ['https://m.youtube.com/@channel'],
        [`https://notyoutube.com/watch?v=${ID}`],
        [`https://youtube.com.evil.com/watch?v=${ID}`],
    ])('refuses %j', async (url) => {
        expect(await addVideo(url)).toEqual({
            videos: [],
            error: 'Невірне посилання на YouTube',
        });
    });
});
