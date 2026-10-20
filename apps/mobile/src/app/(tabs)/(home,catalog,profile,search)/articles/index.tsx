import { useLocalSearchParams } from 'expo-router';

import { ArticleCategoryEnum } from '@hikka/api';

import { ArticleList } from '@/features/articles';

const CATEGORIES = new Set<string>(Object.values(ArticleCategoryEnum));

export default function ArticlesScreen() {
    const { categories } = useLocalSearchParams<{ categories?: string }>();
    const category =
        categories && CATEGORIES.has(categories)
            ? (categories as ArticleCategoryEnum)
            : undefined;

    return <ArticleList key={category ?? 'all'} initialCategory={category} />;
}
