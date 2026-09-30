import { renderToStaticMarkup } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import ArticleProvider from '../../article-provider';
import TitleInput from './title-input';

describe('article title input', () => {
    it('caps the title at the backend limit', () => {
        const container = document.createElement('div');
        container.innerHTML = renderToStaticMarkup(
            <QueryClientProvider client={new QueryClient()}>
                <ArticleProvider initialState={{ title: 'Стаття' }}>
                    <TitleInput />
                </ArticleProvider>
            </QueryClientProvider>,
        );

        const input = container.querySelector('input');

        expect(input?.maxLength).toBe(API_LIMITS.articleTitle.max);
        expect(input?.value).toBe('Стаття');
    });
});
