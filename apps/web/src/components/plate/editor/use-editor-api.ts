import { useEffect } from 'react';

import type { Value } from 'platejs';

export const EDITOR_API_MESSAGE_SOURCE = 'hikka-editor-api';

export type EditorApiCommand = 'get' | 'set' | 'insert';

export type EditorApiRequest = {
    source: typeof EDITOR_API_MESSAGE_SOURCE;
    type: 'request';
    requestId: string;
    editorId: string;
    command: EditorApiCommand | (string & {});
    value?: Value;
};

export type EditorApiError = {
    code:
        | 'invalid_value'
        | 'unknown_command'
        | 'missing_value'
        | 'editor_error';
    message: string;
};

export type EditorApiResponse = {
    source: typeof EDITOR_API_MESSAGE_SOURCE;
    type: 'response';
    requestId: string;
    editorId: string;
    ok: boolean;
    value?: Value;
    error?: EditorApiError;
};

export type EditorApiTarget = {
    children: Value;
    tf: {
        insertNodes: (value: Value, options?: { select?: boolean }) => void;
        setValue: (value: Value) => void;
    };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

// Array.prototype.every skips holes, so density is checked before every walk.
const isDenseNonEmptyArray = (value: unknown): value is unknown[] => {
    if (!Array.isArray(value) || value.length === 0) return false;

    for (let index = 0; index < value.length; index++) {
        if (!(index in value)) return false;
    }

    return true;
};

const isTextNode = (value: unknown): boolean =>
    isRecord(value) && typeof value.text === 'string' && !('children' in value);

const isElementNode = (value: unknown): boolean =>
    isRecord(value) &&
    typeof value.type === 'string' &&
    !('text' in value) &&
    isDenseNonEmptyArray(value.children) &&
    value.children.every((child) => isTextNode(child) || isElementNode(child));

export const isPlateValue = (value: unknown): value is Value =>
    isDenseNonEmptyArray(value) && value.every(isElementNode);

export const isEditorApiRequest = (value: unknown): value is EditorApiRequest =>
    isRecord(value) &&
    value.source === EDITOR_API_MESSAGE_SOURCE &&
    value.type === 'request' &&
    typeof value.requestId === 'string' &&
    typeof value.editorId === 'string' &&
    typeof value.command === 'string';

const response = (
    request: EditorApiRequest,
    payload: Omit<
        EditorApiResponse,
        'source' | 'type' | 'requestId' | 'editorId'
    >,
): EditorApiResponse => ({
    source: EDITOR_API_MESSAGE_SOURCE,
    type: 'response',
    requestId: request.requestId,
    editorId: request.editorId,
    ...payload,
});

const errorResponse = (
    request: EditorApiRequest,
    code: EditorApiError['code'],
    message: string,
): EditorApiResponse =>
    response(request, {
        ok: false,
        error: { code, message },
    });

export function handleEditorApiRequest(
    editor: EditorApiTarget,
    request: EditorApiRequest,
    editorId: string,
): EditorApiResponse | undefined {
    if (request.editorId !== editorId) return undefined;

    if (request.command === 'get') {
        return response(request, { ok: true, value: editor.children });
    }

    if (request.command !== 'set' && request.command !== 'insert') {
        return errorResponse(
            request,
            'unknown_command',
            `Unknown editor API command: ${request.command}`,
        );
    }

    if (request.value === undefined) {
        return errorResponse(
            request,
            'missing_value',
            `The ${request.command} command requires a value.`,
        );
    }

    if (!isPlateValue(request.value)) {
        return errorResponse(
            request,
            'invalid_value',
            `The ${request.command} command requires a valid Plate value.`,
        );
    }

    try {
        if (request.command === 'set') {
            editor.tf.setValue(request.value);
        } else {
            editor.tf.insertNodes(request.value, { select: true });
        }
    } catch (error) {
        return errorResponse(
            request,
            'editor_error',
            error instanceof Error
                ? error.message
                : 'The editor rejected the value.',
        );
    }

    return response(request, { ok: true });
}

export function useEditorApi(editor: EditorApiTarget, editorId?: string) {
    useEffect(() => {
        if (!editorId) return;

        const handleMessage = (event: MessageEvent<unknown>) => {
            if (event.source !== window) return;
            if (!isEditorApiRequest(event.data)) return;

            const result = handleEditorApiRequest(editor, event.data, editorId);
            if (result) {
                window.postMessage(result, window.location.origin);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, [editor, editorId]);
}
