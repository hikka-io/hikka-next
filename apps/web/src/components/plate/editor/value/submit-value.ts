import { MarkdownPlugin } from '@platejs/markdown';
import type { Descendant, SlateEditor, TElement, Value } from 'platejs';

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

/** Drops the editor-only element ids that drag and drop relies on. */
const withoutIds = (nodes: Descendant[]): Descendant[] =>
    nodes.map((node) => {
        if (!('children' in node)) return node;

        const { id: _id, ...element } = node as TElement;
        return { ...element, children: withoutIds(element.children) };
    });

export function getArticleDocument(document: Value): Value {
    return withoutIds(
        trimEmptyBlocks(stripUploadPlaceholders(document) as TElement[]),
    ) as Value;
}
