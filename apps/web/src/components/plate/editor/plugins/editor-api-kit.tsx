import { useEffect } from 'react';

import type { Value } from 'platejs';
import {
    type AnyPlatePlugin,
    createPlatePlugin,
    useEditorRef,
} from 'platejs/react';

export const EDITOR_API_MESSAGE_SOURCE = 'hikka-editor-api';

export type EditorApiCommand = 'get' | 'set' | 'insert';

export type EditorApiRequest = {
    source: typeof EDITOR_API_MESSAGE_SOURCE;
    type: 'request';
    requestId: string;
    editorId: string;
    command: EditorApiCommand | string;
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

export type EditorApiOptions = {
    editorId: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const isSlateNode = (value: unknown): boolean => {
    if (!isRecord(value)) return false;

    if ('text' in value) {
        return typeof value.text === 'string';
    }

    return Array.isArray(value.children) && value.children.every(isSlateNode);
};

export const isPlateValue = (value: unknown): value is Value =>
    Array.isArray(value) && value.every(isSlateNode);

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
    editor: {
        children: Value;
        tf: {
            insertNodes: (value: Value, options?: { select?: boolean }) => void;
            setValue: (value: Value) => void;
        };
    },
    request: EditorApiRequest,
    editorId: string,
): EditorApiResponse | undefined {
    if (request.editorId !== editorId) return undefined;

    switch (request.command) {
        case 'get':
            return response(request, { ok: true, value: editor.children });
        case 'set':
            if (request.value === undefined) {
                return errorResponse(
                    request,
                    'missing_value',
                    'The set command requires a value.',
                );
            }
            if (!isPlateValue(request.value)) {
                return errorResponse(
                    request,
                    'invalid_value',
                    'The value must be a valid Plate value.',
                );
            }
            editor.tf.setValue(request.value);
            return response(request, { ok: true });
        case 'insert':
            if (request.value === undefined) {
                return errorResponse(
                    request,
                    'missing_value',
                    'The insert command requires a value.',
                );
            }
            if (!isPlateValue(request.value)) {
                return errorResponse(
                    request,
                    'invalid_value',
                    'The value must be a valid Plate fragment.',
                );
            }
            editor.tf.insertNodes(request.value, { select: true });
            return response(request, { ok: true });
        default:
            return errorResponse(
                request,
                'unknown_command',
                `Unknown editor API command: ${request.command}`,
            );
    }
}

function EditorApiBridge({ editorId }: { editorId?: string }) {
    const editor = useEditorRef();

    useEffect(() => {
        if (!editorId) return;

        const handleMessage = (event: MessageEvent<unknown>) => {
            if (!isEditorApiRequest(event.data)) return;

            const result = handleEditorApiRequest(editor, event.data, editorId);
            if (result) {
                window.postMessage(result, '*');
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, [editor, editorId]);

    return null;
}

export const EditorApiPlugin = createPlatePlugin({
    key: 'editor-api',
    options: {
        editorId: '',
    } satisfies EditorApiOptions,
    render: {
        afterEditable: () => <EditorApiBridge />,
    },
});

export const createEditorApiKit = (editorId?: string) =>
    (editorId
        ? [
              EditorApiPlugin.configure({
                  options: { editorId },
                  render: {
                      afterEditable: () => (
                          <EditorApiBridge editorId={editorId} />
                      ),
                  },
              }),
          ]
        : []) as AnyPlatePlugin[];
