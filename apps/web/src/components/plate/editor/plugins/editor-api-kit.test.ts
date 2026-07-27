import type { Value } from 'platejs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    editorId: 'article-body',
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
    beforeEach(() => vi.clearAllMocks());

    it('recognizes only editor API request envelopes', () => {
        expect(isEditorApiRequest(request('get'))).toBe(true);
        expect(
            isEditorApiRequest({
                source: 'other-plugin',
                type: 'request',
                requestId: 'request-1',
                editorId: 'article-body',
                command: 'get',
            }),
        ).toBe(false);
    });

    it('validates Plate values recursively', () => {
        expect(isPlateValue(value)).toBe(true);
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
            'article-body',
        );

        expect(result).toMatchObject({
            source: EDITOR_API_MESSAGE_SOURCE,
            type: 'response',
            requestId: 'request-1',
            editorId: 'article-body',
            ok: true,
            value,
        });
    });

    it('sets and inserts through editor transforms', () => {
        const editor = createEditor();
        const fragment = [{ type: 'p', children: [{ text: 'Inserted' }] }];

        expect(
            handleEditorApiRequest(
                editor,
                request('set', { value: fragment }),
                'article-body',
            ),
        ).toMatchObject({ ok: true });
        expect(editor.tf.setValue).toHaveBeenCalledWith(fragment);

        expect(
            handleEditorApiRequest(
                editor,
                request('insert', { value: fragment }),
                'article-body',
            ),
        ).toMatchObject({ ok: true });
        expect(editor.tf.insertNodes).toHaveBeenCalledWith(fragment, {
            select: true,
        });
    });

    it('returns structured errors for invalid commands and values', () => {
        const editor = createEditor();

        expect(
            handleEditorApiRequest(
                editor,
                request('set', {
                    value: [{ type: 'p' }] as unknown as Value,
                }),
                'article-body',
            ),
        ).toMatchObject({ ok: false, error: { code: 'invalid_value' } });

        expect(
            handleEditorApiRequest(editor, request('remove'), 'article-body'),
        ).toMatchObject({ ok: false, error: { code: 'unknown_command' } });
    });

    it('ignores requests intended for another editor', () => {
        const editor = createEditor();

        expect(
            handleEditorApiRequest(editor, request('get'), 'comment-body'),
        ).toBeUndefined();
    });
});
