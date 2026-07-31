import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { createPlateEditor, Plate, PlateContent } from 'platejs/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    EDITOR_API_MESSAGE_SOURCE,
    EditorApiKit,
    EditorApiPlugin,
    type EditorApiResponse,
} from './editor-api-kit';

const EDITOR_ID = 'article-editor';

const document_ = [{ type: 'p', children: [{ text: 'IMPORTANT DRAFT' }] }];

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.restoreAllMocks();
});

async function mountEditor() {
    const editor = createPlateEditor({
        plugins: EditorApiKit,
        value: document_,
    });
    const container = window.document.createElement('div');
    window.document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
        root.render(
            <Plate editor={editor}>
                <PlateContent />
            </Plate>,
        );
    });

    const unmount = () => {
        root.unmount();
        container.remove();
    };
    teardown.push(unmount);

    const setEditorId = async (editorId: string) => {
        await act(async () => {
            editor.setOption(EditorApiPlugin, 'editorId', editorId);
        });
    };

    return { editor, setEditorId, unmount };
}

async function send(
    command: string,
    options: { value?: unknown; source?: unknown } = {},
) {
    const replies: EditorApiResponse[] = [];
    const collect = (event: MessageEvent) => {
        if ((event.data as EditorApiResponse)?.type === 'response') {
            replies.push(event.data);
        }
    };
    window.addEventListener('message', collect);

    await act(async () => {
        window.dispatchEvent(
            new MessageEvent('message', {
                source: (options.source ?? window) as MessageEventSource,
                data: {
                    source: EDITOR_API_MESSAGE_SOURCE,
                    type: 'request',
                    requestId: 'request-1',
                    editorId: EDITOR_ID,
                    command,
                    value: options.value,
                },
            }),
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
    });

    window.removeEventListener('message', collect);
    return replies;
}

describe('editor API bridge mounting', () => {
    it('registers no listener until an editorId is configured', async () => {
        const addEventListener = vi.spyOn(window, 'addEventListener');
        const messageListeners = () =>
            addEventListener.mock.calls.filter(([type]) => type === 'message')
                .length;
        const { setEditorId } = await mountEditor();

        expect(messageListeners()).toBe(0);

        await setEditorId(EDITOR_ID);

        expect(messageListeners()).toBe(1);
    });

    it('starts and stops answering as the editorId option changes', async () => {
        const { editor, setEditorId } = await mountEditor();

        await setEditorId(EDITOR_ID);
        expect(await send('get')).toMatchObject([
            { ok: true, value: editor.children },
        ]);

        await setEditorId('');
        expect(await send('get')).toHaveLength(0);

        await setEditorId(EDITOR_ID);
        expect(await send('get')).toHaveLength(1);
    });

    it('ignores messages posted from another window', async () => {
        const { setEditorId } = await mountEditor();
        await setEditorId(EDITOR_ID);

        expect(await send('get', { source: {} })).toHaveLength(0);
    });

    it('rejects a destructive value and leaves the document intact', async () => {
        const { editor, setEditorId } = await mountEditor();
        await setEditorId(EDITOR_ID);

        expect(await send('set', { value: [] })).toMatchObject([
            { ok: false, error: { code: 'invalid_value' } },
        ]);
        expect(editor.children).toMatchObject(document_);
    });

    it('applies a valid set to the editor', async () => {
        const { editor, setEditorId } = await mountEditor();
        await setEditorId(EDITOR_ID);

        const next = [{ type: 'p', children: [{ text: 'Replaced' }] }];

        expect(await send('set', { value: next })).toMatchObject([
            { ok: true },
        ]);
        expect(editor.children).toMatchObject(next);
    });

    it('removes its listener on unmount', async () => {
        const { setEditorId, unmount } = await mountEditor();
        await setEditorId(EDITOR_ID);

        await act(async () => unmount());

        expect(await send('get')).toHaveLength(0);
    });
});
