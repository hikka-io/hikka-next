import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { View } from 'react-native';

import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/features/auth';

import { useVisibleOnce } from './detail-scroll';
import FollowingRow, { FollowingRowSkeleton } from './following-row';
import type { ContentInfo } from './queries';
import { contentFollowingOptions, FOLLOWING_PREVIEW_SIZE } from './queries';

const SKELETONS: null[] = Array.from(
    { length: FOLLOWING_PREVIEW_SIZE },
    () => null,
);

type Props = {
    content: ContentInfo;
};

/** The web's "Відстежується": followed users who track the title, signed in only, hidden when there are none. */
const ContentFollowings: FC<Props> = ({ content }) => {
    const { user } = useSession();
    const { onLayout, visible } = useVisibleOnce();
    const { data, isPending, error, refetch } = useInfiniteQuery({
        ...contentFollowingOptions(content.data_type, content.slug, {
            preview: true,
        }),
        enabled: !!user && visible,
    });
    const items = data?.pages[0]?.list;

    if (!user || (!isPending && !error && !items?.length)) return null;

    return (
        <View onLayout={onLayout} className="gap-3">
            <Header>
                <HeaderTitle
                    href={`/followings/${content.data_type}/${content.slug}`}
                    count={data?.pages[0]?.pagination.total}
                    countPending={isPending && !error}
                >
                    Відстежується
                </HeaderTitle>
            </Header>
            {error ? (
                <ErrorState variant="inline" onRetry={() => void refetch()} />
            ) : (
                <Card className="gap-0 overflow-hidden p-0">
                    {(items ?? SKELETONS).map((item, index) => (
                        <View key={item?.reference ?? `skeleton-${index}`}>
                            {index > 0 && <Separator />}
                            {item ? (
                                <FollowingRow user={item} />
                            ) : (
                                <FollowingRowSkeleton />
                            )}
                        </View>
                    ))}
                </Card>
            )}
        </View>
    );
};

export default ContentFollowings;
