import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, useIsFocused } from 'expo-router';
import { FilePen } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import {
    ArticleRow,
    ArticleRowSkeleton,
    AUTHOR_ARTICLES_PREVIEW_SIZE,
    authorArticlesPreviewOptions,
} from '@/features/articles';
import { useSession } from '@/features/auth';

type Props = {
    username: string;
};

/** The web's "Статті" block: the author's first articles, hidden when there are none; the owner also gets the drafts. */
const ArticlesSection: FC<Props> = ({ username }) => {
    const { user: viewer } = useSession();
    const { data, isPending, error, refetch } = useInfiniteQuery({
        ...authorArticlesPreviewOptions(username),
        subscribed: useIsFocused(),
    });
    const items = data?.pages[0]?.list.slice(0, AUTHOR_ARTICLES_PREVIEW_SIZE);
    const owner = viewer?.username?.toLowerCase() === username.toLowerCase();

    if (!isPending && !error && !items?.length) return null;

    return (
        <View className="px-4 pt-6">
            <View className="gap-3">
                <Header>
                    <HeaderTitle
                        href={{
                            pathname: '/articles',
                            params: { author: username },
                        }}
                    >
                        Статті
                    </HeaderTitle>
                    {owner && (
                        <HeaderActions>
                            <Link
                                href={{
                                    pathname: '/articles',
                                    params: { draft: 'true' },
                                }}
                                asChild
                            >
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    accessibilityLabel="Чернетки"
                                >
                                    <Icon as={FilePen} />
                                </Button>
                            </Link>
                        </HeaderActions>
                    )}
                </Header>
                {error ? (
                    <ErrorState
                        variant="inline"
                        onRetry={() => void refetch()}
                    />
                ) : (
                    <Card className="gap-0 overflow-hidden p-0">
                        {(
                            items ??
                            Array.from(
                                { length: AUTHOR_ARTICLES_PREVIEW_SIZE },
                                () => null,
                            )
                        ).map((article, index) => (
                            <View key={article?.slug ?? `skeleton-${index}`}>
                                {index > 0 && <Separator />}
                                {article ? (
                                    <ArticleRow article={article} compact />
                                ) : (
                                    <ArticleRowSkeleton compact />
                                )}
                            </View>
                        ))}
                    </Card>
                )}
            </View>
        </View>
    );
};

export default ArticlesSection;
