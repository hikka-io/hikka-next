import { MarkdownPlugin } from '@platejs/markdown';
import type { Descendant, SlateEditor, TElement, Value } from 'platejs';

import { normalizeYouTubeVideoUrl } from '@hikka/core';

import { ELEMENT_VIDEO } from '../plate-types';
import { trimEmptyBlocks } from './trim-empty-blocks';
import { stripUploadPlaceholders } from './upload-placeholders';

export function getCommentValue(editor: SlateEditor): TElement[] {
    return trimEmptyBlocks(editor.children as TElement[]);
}

export function getCommentText(
    editor: SlateEditor,
    value: Value = editor.children,
): string {
    const trimmed = trimEmptyBlocks(value as TElement[]);

    if (trimmed.length === 0) return '';

    return editor.getApi(MarkdownPlugin).markdown.serialize({ value: trimmed });
}

// Saved articles can hold videos on www. or m.youtube.com, which the backend no longer accepts, so they would fail every save.
const videoUrl = (element: TElement) =>
    element.type === ELEMENT_VIDEO && typeof element.url === 'string'
        ? normalizeYouTubeVideoUrl(element.url)
        : null;

/** Drops the editor-only element ids that drag and drop relies on, and moves video urls to the bare youtube.com host. */
const toSubmitted = (nodes: Descendant[]): Descendant[] =>
    nodes.map((node) => {
        if (!('children' in node)) return node;

        const { id: _id, ...element } = node as TElement;
        const url = videoUrl(element);

        return {
            ...element,
            ...(url && { url }),
            children: toSubmitted(element.children),
        };
    });

export function getArticleDocument(document: Value): Value {
    return toSubmitted(
        trimEmptyBlocks(stripUploadPlaceholders(document) as TElement[]),
    ) as Value;
}
