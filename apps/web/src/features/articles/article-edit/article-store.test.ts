import { describe, expect, it } from 'vitest';

import type { ArticleDocumentResponse } from '@hikka/api';

import { articleToState, createArticleStore } from './article-store';

describe('article store', () => {
    it('maps an article response to the editable state', () => {
        const article = {
            slug: 'stattya-1',
            title: 'Стаття',
            category: 'reviews',
            document: [{ type: 'p', children: [{ text: 'x' }] }],
            tags: [{ name: 'огляд', content_count: 3 }],
            draft: false,
            content: null,
            updated: 1,
            author: { username: 'olexh' },
        } as unknown as ArticleDocumentResponse;

        expect(articleToState(article)).toEqual({
            slug: 'stattya-1',
            title: 'Стаття',
            category: 'reviews',
            document: article.document,
            tags: ['огляд'],
            draft: false,
            content: null,
        });
    });

    it('takes only identity and status from a save response', () => {
        const store = createArticleStore({ title: 'Нове' });

        store.getState().setSaved({ slug: 'stattya-1', draft: true });

        expect(store.getState()).toMatchObject({
            slug: 'stattya-1',
            draft: true,
            title: 'Нове',
        });
    });
});
