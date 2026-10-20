import { describe, expect, it } from 'vitest';

import type { ArticlePreviewResponse } from '@hikka/api';

import { getArticleExcerpt } from './article-excerpt';

const preview = (value: unknown) => value as ArticlePreviewResponse['preview'];

describe('getArticleExcerpt', () => {
    it('returns the text of the first non-empty block', () => {
        expect(
            getArticleExcerpt(
                preview([
                    { children: [{ text: '  ' }] },
                    { children: [{ text: 'Hello ' }, { text: 'world' }] },
                    { children: [{ text: 'Second' }] },
                ]),
            ),
        ).toBe('Hello world');
    });

    it('returns an empty string when there is no text', () => {
        expect(getArticleExcerpt(preview([]))).toBe('');
    });
});
