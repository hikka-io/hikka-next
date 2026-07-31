import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { createPlateEditor } from 'platejs/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    EDITOR_API_MESSAGE_SOURCE,
    type EditorApiResponse,
    useEditorApi,
} from './use-editor-api';

const EDITOR_ID = 'comment-anime-frieren';

const initialValue = [{ type: 'p', children: [{ text: 'IMPORTANT DRAFT' }] }];

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    vi.restoreAllMocks();
});

function Host({
    editor,
    editorId,
}: {
    editor: ReturnType<typeof createPlateEditor>;
    editorId?: string;
}) {
    useEditorApi(editor, editorId);

    return null;
}

async function mountHost(editorId?: string) {
    const editor = createPlateEditor({ value: initialValue });
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);

    const render = async (nextEditorId?: string) => {
        await act(async () => {
            root.render(<Host editor={editor} editorId={nextEditorId} />);
        });
    };

    await render(editorId);

    const unmount = () => {
        root.unmount();
        container.remove();
    };
    teardown.push(unmount);

    return { editor, render, unmount };
}

async function send(
    command: string,
    options: { editorId?: string; value?: unknown; source?: unknown } = {},
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
                    editorId: options.editorId ?? EDITOR_ID,
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

describe('useEditorApi listener', () => {
    it('registers no listener without an editorId', async () => {
        const addEventListener = vi.spyOn(window, 'addEventListener');
        const messageListeners = () =>
            addEventListener.mock.calls.filter(([type]) => type === 'message')
                .length;

        const { render } = await mountHost();
        expect(messageListeners()).toBe(0);

        await render(EDITOR_ID);
        expect(messageListeners()).toBe(1);
    });

    it('starts and stops answering as the editorId changes', async () => {
        const { editor, render } = await mountHost(EDITOR_ID);

        expect(await send('get')).toMatchObject([
            { ok: true, value: editor.children },
        ]);

        await render(undefined);
        expect(await send('get')).toHaveLength(0);

        await render(EDITOR_ID);
        expect(await send('get')).toHaveLength(1);
    });

    it('ignores messages posted from another window', async () => {
        await mountHost(EDITOR_ID);

        expect(await send('get', { source: {} })).toHaveLength(0);
    });

    it('answers only the editor the request targets', async () => {
        const reply = await mountHost('comment-reply-abc');
        const edit = await mountHost('comment-edit-abc');

        const next = [{ type: 'p', children: [{ text: 'Replaced' }] }];
        const replies = await send('set', {
            editorId: 'comment-edit-abc',
            value: next,
        });

        expect(replies).toHaveLength(1);
        expect(edit.editor.children).toMatchObject(next);
        expect(reply.editor.children).toMatchObject(initialValue);
    });

    it('rejects a destructive value and leaves the document intact', async () => {
        const { editor } = await mountHost(EDITOR_ID);

        expect(await send('set', { value: [] })).toMatchObject([
            { ok: false, error: { code: 'invalid_value' } },
        ]);
        expect(editor.children).toMatchObject(initialValue);
    });

    it('applies a valid set to the editor', async () => {
        const { editor } = await mountHost(EDITOR_ID);

        const next = [{ type: 'p', children: [{ text: 'Replaced' }] }];

        expect(await send('set', { value: next })).toMatchObject([
            { ok: true },
        ]);
        expect(editor.children).toMatchObject(next);
    });

    it('removes its listener on unmount', async () => {
        const { unmount } = await mountHost(EDITOR_ID);

        await act(async () => unmount());

        expect(await send('get')).toHaveLength(0);
    });
});
