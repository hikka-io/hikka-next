import type { Value } from 'platejs';
import { describe, expect, it, vi } from 'vitest';

import {
    EDITOR_API_MESSAGE_SOURCE,
    type EditorApiRequest,
    handleEditorApiRequest,
    isEditorApiRequest,
    isPlateValue,
} from './editor-api-kit';

const value = [{ type: 'p', children: [{ text: 'Hello' }] }];

const request = (
    command: string,
    options: Partial<EditorApiRequest> = {},
): EditorApiRequest => ({
    source: EDITOR_API_MESSAGE_SOURCE,
    type: 'request',
    requestId: 'request-1',
    editorId: 'article-editor',
    command,
    ...options,
});

function createEditor() {
    return {
        children: value,
        tf: {
            insertNodes: vi.fn(),
            setValue: vi.fn(),
        },
    };
}

describe('editor API bridge', () => {
    it('recognizes only editor API request envelopes', () => {
        expect(isEditorApiRequest(request('get'))).toBe(true);
        expect(
            isEditorApiRequest({
                source: 'other-plugin',
                type: 'request',
                requestId: 'request-1',
                editorId: 'article-editor',
                command: 'get',
            }),
        ).toBe(false);
    });

    it('accepts documents made of well-formed elements', () => {
        expect(isPlateValue(value)).toBe(true);
        expect(
            isPlateValue([
                {
                    type: 'a',
                    url: 'https://hikka.io',
                    children: [{ text: 'link', bold: true }],
                },
            ]),
        ).toBe(true);
    });

    it('rejects values that would destroy or corrupt the document', () => {
        expect(isPlateValue([])).toBe(false);
        expect(isPlateValue(new Array(2))).toBe(false);
        expect(isPlateValue([{ text: 'bare leaf' }])).toBe(false);
        expect(isPlateValue([{ children: [{ text: 'no type' }] }])).toBe(false);
        expect(isPlateValue([{ type: 'p', children: [] }])).toBe(false);
        expect(
            isPlateValue([
                { type: 'p', children: [{ text: 'a', children: 'nope' }] },
            ]),
        ).toBe(false);
        expect(isPlateValue([{ type: 'p', children: [{ text: 1 }] }])).toBe(
            false,
        );
        expect(isPlateValue([{ type: 'p' }])).toBe(false);
    });

    it('returns the current value for get', () => {
        const editor = createEditor();
        const result = handleEditorApiRequest(
            editor,
            request('get'),
            'article-editor',
        );

        expect(result).toMatchObject({
            source: EDITOR_API_MESSAGE_SOURCE,
            type: 'response',
            requestId: 'request-1',
            editorId: 'article-editor',
            ok: true,
            value,
        });
    });

    it('replaces the document for set and leaves insert untouched', () => {
        const editor = createEditor();
        const fragment = [{ type: 'p', children: [{ text: 'Inserted' }] }];

        expect(
            handleEditorApiRequest(
                editor,
                request('set', { value: fragment }),
                'article-editor',
            ),
        ).toMatchObject({ ok: true });
        expect(editor.tf.setValue).toHaveBeenCalledTimes(1);
        expect(editor.tf.setValue).toHaveBeenCalledWith(fragment);
        expect(editor.tf.insertNodes).not.toHaveBeenCalled();
    });

    it('inserts a fragment and leaves set untouched', () => {
        const editor = createEditor();
        const fragment = [{ type: 'p', children: [{ text: 'Inserted' }] }];

        expect(
            handleEditorApiRequest(
                editor,
                request('insert', { value: fragment }),
                'article-editor',
            ),
        ).toMatchObject({ ok: true });
        expect(editor.tf.insertNodes).toHaveBeenCalledTimes(1);
        expect(editor.tf.insertNodes).toHaveBeenCalledWith(fragment, {
            select: true,
        });
        expect(editor.tf.setValue).not.toHaveBeenCalled();
    });

    it.each([
        'set',
        'insert',
    ])('rejects %s without a value and never touches the editor', (command) => {
        const editor = createEditor();

        expect(
            handleEditorApiRequest(editor, request(command), 'article-editor'),
        ).toMatchObject({ ok: false, error: { code: 'missing_value' } });
        expect(editor.tf.setValue).not.toHaveBeenCalled();
        expect(editor.tf.insertNodes).not.toHaveBeenCalled();
    });

    it.each([
        'set',
        'insert',
    ])('rejects an invalid %s value and never touches the editor', (command) => {
        const editor = createEditor();

        expect(
            handleEditorApiRequest(
                editor,
                request(command, { value: [] as unknown as Value }),
                'article-editor',
            ),
        ).toMatchObject({ ok: false, error: { code: 'invalid_value' } });
        expect(editor.tf.setValue).not.toHaveBeenCalled();
        expect(editor.tf.insertNodes).not.toHaveBeenCalled();
    });

    it('reports unknown commands', () => {
        const editor = createEditor();

        expect(
            handleEditorApiRequest(editor, request('remove'), 'article-editor'),
        ).toMatchObject({ ok: false, error: { code: 'unknown_command' } });
    });

    it('reports editor_error when a transform throws', () => {
        const editor = createEditor();
        editor.tf.setValue.mockImplementation(() => {
            throw new Error('editor rejected the value');
        });

        expect(
            handleEditorApiRequest(
                editor,
                request('set', { value }),
                'article-editor',
            ),
        ).toMatchObject({
            ok: false,
            error: {
                code: 'editor_error',
                message: 'editor rejected the value',
            },
        });
    });

    it('ignores requests intended for another editor', () => {
        const editor = createEditor();

        expect(
            handleEditorApiRequest(editor, request('get'), 'comment-editor'),
        ).toBeUndefined();
    });
});
