import { useLocalSearchParams } from 'expo-router';

import { ArticlePage } from '@/features/articles';

export default function ArticleScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    return <ArticlePage key={slug} slug={slug} />;
}
