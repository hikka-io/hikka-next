import { ElementApi, NodeApi, type TElement, type Value } from 'platejs';

import {
    API_LIMITS,
    type ArticleArgs,
    type ArticleContentEnum,
} from '@hikka/api';
import { isValidTitleLength } from '@hikka/core';

import { ELEMENT_IMAGE } from '@/components/plate/editor/plate-types';
import { getArticleDocument } from '@/components/plate/editor/value/submit-value';
import { hasPendingUploads } from '@/components/plate/editor/value/upload-placeholders';

import type { ArticleState } from './article-store';

export type ArticleContentBody = Omit<ArticleArgs, 'draft'>;

/** Mirrors `validate_document_length` in the backend `app/articles/schemas.py`. */
export const ARTICLE_TEXT_MAX = 65_536;

export type DocumentFacts = {
    /** The document a save sends: upload placeholders and blank blocks dropped. */
    submitted: Value;
    /** Code points of every text node, as the backend counts them. */
    characters: number;
    words: number;
    pendingUploads: boolean;
    /** The backend rejects a document that uses one image twice. */
    duplicateImages: boolean;
};

const EMPTY_DOCUMENT: Value = [];

// Every edit makes a new document, so one analysis per document serves all the selectors reading it.
const factsCache = new WeakMap<Value, DocumentFacts>();

const imageUrls = (document: Value) => {
    const urls: string[] = [];

    for (const [node] of NodeApi.nodes({ children: document } as TElement)) {
        if (ElementApi.isElement(node) && node.type === ELEMENT_IMAGE) {
            urls.push(String(node.url ?? ''));
        }
    }

    return urls;
};

export function documentFacts(document = EMPTY_DOCUMENT): DocumentFacts {
    const cached = factsCache.get(document);
    if (cached) return cached;

    const submitted = getArticleDocument(document);
    const texts = submitted.map((node) => NodeApi.string(node));
    const urls = imageUrls(submitted);

    const facts: DocumentFacts = {
        submitted,
        characters: texts.reduce((sum, text) => sum + [...text].length, 0),
        words: texts.join(' ').split(/\s+/).filter(Boolean).length,
        pendingUploads: hasPendingUploads(document),
        duplicateImages: new Set(urls).size !== urls.length,
    };

    factsCache.set(document, facts);
    return facts;
}

export function canSaveArticle(state: ArticleState): boolean {
    const facts = documentFacts(state.document);

    return (
        isValidTitleLength(state.title, API_LIMITS.articleTitle) &&
        !facts.pendingUploads &&
        facts.submitted.length > 0 &&
        facts.characters <= ARTICLE_TEXT_MAX &&
        !facts.duplicateImages
    );
}

export function buildArticleContent(state: ArticleState): ArticleContentBody {
    return {
        title: state.title?.trim() ?? '',
        document: documentFacts(state.document).submitted,
        tags: state.tags,
        category: state.category,
        content: state.content
            ? {
                  slug: state.content.slug,
                  content_type: state.content.data_type as ArticleContentEnum,
              }
            : undefined,
    };
}
