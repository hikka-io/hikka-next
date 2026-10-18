import type { Value } from 'platejs';
import { describe, expect, it } from 'vitest';

import { API_LIMITS, ArticleCategoryEnum } from '@hikka/api';

import type { ArticleContent } from '../types';
import {
    buildArticleContent,
    canSaveArticle,
    documentFacts,
} from './article-body';
import type { ArticleState } from './article-store';

const { min: MIN, max: MAX } = API_LIMITS.articleTitle;

const PARAGRAPH = { type: 'p', children: [{ text: 'Текст' }] };
const BLANK = { type: 'p', children: [{ text: '' }] };

const imageGroup = (...urls: string[]) => ({
    type: 'image_group',
    children: urls.map((url) => ({
        type: 'image',
        url,
        children: [{ text: '' }],
    })),
});

const state = (overrides: Partial<ArticleState> = {}): ArticleState => ({
    title: 'Стаття',
    category: ArticleCategoryEnum.NEWS,
    document: [PARAGRAPH],
    tags: [],
    draft: true,
    ...overrides,
});

describe('canSaveArticle', () => {
    it.each([
        ['the minimum length', 'a'.repeat(MIN)],
        ['the maximum length', 'a'.repeat(MAX)],
    ])('accepts a title of %s', (_, title) => {
        expect(canSaveArticle(state({ title }))).toBe(true);
    });

    it.each([
        ['no title', undefined],
        ['a title below the minimum', 'a'.repeat(MIN - 1)],
        ['a blank title', ' '.repeat(MIN + 2)],
        ['a title over the maximum', 'a'.repeat(MAX + 1)],
    ])('rejects %s', (_, title) => {
        expect(canSaveArticle(state({ title }))).toBe(false);
    });

    it('rejects a document that repeats an image', () => {
        const document = [
            PARAGRAPH,
            imageGroup('a.jpg', 'b.jpg'),
            imageGroup('a.jpg'),
        ];

        expect(canSaveArticle(state({ document }))).toBe(false);
    });

    it('rejects a document with nothing but blank blocks', () => {
        expect(canSaveArticle(state({ document: [BLANK, BLANK] }))).toBe(false);
    });

    it('rejects a document with an image still uploading', () => {
        const uploading = {
            type: 'image_group',
            children: [
                {
                    type: 'image_placeholder',
                    status: 'uploading',
                    children: [{ text: '' }],
                },
            ],
        };

        expect(
            canSaveArticle(state({ document: [PARAGRAPH, uploading] })),
        ).toBe(false);
    });
});

describe('buildArticleContent', () => {
    it('sends the trimmed title and the trimmed document', () => {
        const body = buildArticleContent(
            state({ title: '  Стаття  ', document: [PARAGRAPH, BLANK] }),
        );

        expect(body).toMatchObject({
            title: 'Стаття',
            document: [PARAGRAPH],
            content: undefined,
        });
    });

    it('references the linked content by slug and type', () => {
        const content = {
            slug: 'frieren-123',
            data_type: 'anime',
        } as ArticleContent;

        expect(buildArticleContent(state({ content })).content).toEqual({
            slug: 'frieren-123',
            content_type: 'anime',
        });
    });
});

describe('documentFacts', () => {
    it('reports an empty document as zero', () => {
        expect(documentFacts([])).toMatchObject({
            characters: 0,
            words: 0,
            pendingUploads: false,
            duplicateImages: false,
        });
    });

    it('counts words and characters across blocks', () => {
        const document: Value = [
            { type: 'h3', children: [{ text: 'Заголовок' }] },
            { type: 'p', children: [{ text: 'Два  слова' }] },
        ];

        expect(documentFacts(document)).toMatchObject({
            words: 3,
            characters: 19,
        });
    });

    it('counts an emoji as one character, like the backend', () => {
        expect(
            documentFacts([{ type: 'p', children: [{ text: 'аніме 🌸' }] }])
                .characters,
        ).toBe(7);
    });

    it('analyses each document once', () => {
        const document: Value = [PARAGRAPH];

        expect(documentFacts(document)).toBe(documentFacts(document));
    });
});
