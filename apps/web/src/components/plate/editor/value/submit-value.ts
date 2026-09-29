import { MarkdownPlugin } from '@platejs/markdown';
import type { SlateEditor, TElement, Value } from 'platejs';

import { trimEmptyBlocks } from './trim-empty-blocks';
import { stripUploadPlaceholders } from './upload-placeholders';

export function getCommentValue(editor: SlateEditor): TElement[] {
    return trimEmptyBlocks(editor.children as TElement[]);
}

export function getCommentText(editor: SlateEditor): string {
    const value = getCommentValue(editor);

    if (value.length === 0) return '';

    return editor.getApi(MarkdownPlugin).markdown.serialize({ value });
}

export function getArticleDocument(document: Value): Value {
    return trimEmptyBlocks(stripUploadPlaceholders(document) as TElement[]);
}
