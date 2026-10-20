import { useLocalSearchParams } from 'expo-router';

import { MainContentTypeEnum } from '@hikka/api';
import { articlesSearchFromParams } from '@hikka/core';

import { ArticleList } from '@/features/articles';
import { contentArticlesOptions } from '@/features/content';

const CONTENT_TYPES: readonly string[] = Object.values(MainContentTypeEnum);

const isContentType = (value: unknown): value is MainContentTypeEnum =>
    typeof value === 'string' && CONTENT_TYPES.includes(value);

export default function ArticlesScreen() {
    const params = useLocalSearchParams<Record<string, string | string[]>>();
    const search = articlesSearchFromParams(params);
    const { content_type, content_slug } = params;

    if (isContentType(content_type) && typeof content_slug === 'string') {
        return (
            <ArticleList
                key={`${content_type}/${content_slug}`}
                initialSearch={search}
                options={contentArticlesOptions(content_type, content_slug)}
                emptyTitle="Статей ще немає"
                emptyDescription="Тут зʼявляться статті, повʼязані з цим тайтлом"
            />
        );
    }

    return <ArticleList key={JSON.stringify(search)} initialSearch={search} />;
}
