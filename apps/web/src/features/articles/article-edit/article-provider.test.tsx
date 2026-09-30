import { renderToStaticMarkup } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import ArticleProvider, { useArticleContext } from './article-provider';

const Title = () => <span>{useArticleContext((state) => state.title)}</span>;

describe('useArticleContext', () => {
    it('reads the store without registering any query', () => {
        const queryClient = new QueryClient();

        const html = renderToStaticMarkup(
            <QueryClientProvider client={queryClient}>
                <ArticleProvider initialState={{ title: 'Нова стаття' }}>
                    <Title />
                </ArticleProvider>
            </QueryClientProvider>,
        );

        expect(html).toBe('<span>Нова стаття</span>');
        expect(queryClient.getQueryCache().getAll()).toEqual([]);
    });

    it('throws outside the provider', () => {
        expect(() => renderToStaticMarkup(<Title />)).toThrow(
            'Missing ArticleContext.Provider in the tree',
        );
    });
});
