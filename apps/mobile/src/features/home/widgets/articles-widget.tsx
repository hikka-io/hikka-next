import { type FC, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Newspaper } from 'lucide-react-native';
import { View } from 'react-native';

import type { CommunityTab } from '@hikka/core';

import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import SegmentedControl from '@/components/ui/segmented-control';
import { Separator } from '@/components/ui/separator';
import { ArticleRow, ArticleRowSkeleton } from '@/features/articles';

import { flattenPages } from '../flatten-pages';
import { ARTICLES_PREVIEW_SIZE, homeArticlesTabOptions } from '../queries';
import WidgetSection from '../widget-section';

type Props = {
    username?: string;
};

const ArticlesWidget: FC<Props> = ({ username }) => {
    const [tab, setTab] = useState<CommunityTab>('newest');
    const own = !!username && tab === 'own';
    const { data, isPending, isError, refetch } = useInfiniteQuery(
        homeArticlesTabOptions(tab, username),
    );
    const list = flattenPages(data);

    const tabs = [
        { value: 'newest' as const, label: 'Нові' },
        { value: 'popular' as const, label: 'Популярні' },
        ...(username ? [{ value: 'own' as const, label: 'Мої' }] : []),
    ];

    return (
        <WidgetSection title="Статті" href="/articles">
            <SegmentedControl
                options={tabs}
                value={tab}
                onValueChange={setTab}
            />
            {isError && <ErrorState variant="section" onRetry={refetch} />}
            {(isPending || (list && list.length > 0)) && (
                <Card className="gap-0 overflow-hidden p-0">
                    {isPending &&
                        Array.from(
                            { length: ARTICLES_PREVIEW_SIZE },
                            (_, index) => (
                                <View key={index}>
                                    {index > 0 && <Separator />}
                                    <ArticleRowSkeleton />
                                </View>
                            ),
                        )}
                    {list?.map((article, index) => (
                        <View key={article.slug}>
                            {index > 0 && <Separator />}
                            <ArticleRow article={article} />
                        </View>
                    ))}
                </Card>
            )}
            {list?.length === 0 && (
                <EmptyState
                    size="sm"
                    bordered
                    icon={<Icon as={Newspaper} />}
                    title={own ? 'У вас ще немає статей' : 'Немає статей'}
                />
            )}
        </WidgetSection>
    );
};

export default ArticlesWidget;
