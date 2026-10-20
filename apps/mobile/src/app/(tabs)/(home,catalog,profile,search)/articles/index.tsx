import { useLocalSearchParams } from 'expo-router';

import { articlesSearchFromParams } from '@hikka/core';

import { ArticleList } from '@/features/articles';

export default function ArticlesScreen() {
    const params = useLocalSearchParams<Record<string, string | string[]>>();
    const search = articlesSearchFromParams(params);

    return <ArticleList key={JSON.stringify(search)} initialSearch={search} />;
}
