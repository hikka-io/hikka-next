import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { type LayoutChangeEvent, View } from 'react-native';

import type { CollectionContentTypeEnum } from '@hikka/api';

import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Separator } from '@/components/ui/separator';
import { CollectionRow, CollectionRowSkeleton } from '@/features/collections';

import { useVisibleOnce } from './detail-scroll';
import {
    COLLECTIONS_PREVIEW_SIZE,
    type ContentInfo,
    contentCollectionsOptions,
} from './queries';

const SKELETONS: null[] = Array.from(
    { length: COLLECTIONS_PREVIEW_SIZE },
    () => null,
);

type Props = {
    contentType: CollectionContentTypeEnum;
    slug: string;
    /** Below the fold: the list loads once the block nears the viewport. */
    enabled?: boolean;
    onLayout?: (event: LayoutChangeEvent) => void;
    className?: string;
};

/** The web's `ContentCollections`: the newest collections holding this entry, hidden when there are none. */
const ContentCollections: FC<Props> = ({
    contentType,
    slug,
    enabled = true,
    onLayout,
    className,
}) => {
    const { data, isPending, error, refetch } = useInfiniteQuery({
        ...contentCollectionsOptions(contentType, slug, { preview: true }),
        enabled,
    });
    const items = data?.pages[0]?.list;

    if (!isPending && !error && !items?.length) return null;

    return (
        <View onLayout={onLayout} className={className}>
            <View className="gap-3">
                <Header>
                    <HeaderTitle
                        href={{
                            pathname: '/collections',
                            params: {
                                content_type: contentType,
                                content: slug,
                            },
                        }}
                        count={data?.pages[0]?.pagination.total}
                        countPending={isPending && !error}
                    >
                        Колекції
                    </HeaderTitle>
                </Header>
                {error ? (
                    <ErrorState
                        variant="inline"
                        onRetry={() => void refetch()}
                    />
                ) : (
                    <Card className="gap-0 overflow-hidden p-0">
                        {(items ?? SKELETONS).map((collection, index) => (
                            <View
                                key={
                                    collection?.reference ?? `skeleton-${index}`
                                }
                            >
                                {index > 0 && <Separator />}
                                {collection ? (
                                    <CollectionRow collection={collection} />
                                ) : (
                                    <CollectionRowSkeleton />
                                )}
                            </View>
                        ))}
                    </Card>
                )}
            </View>
        </View>
    );
};

type SectionProps = {
    content: ContentInfo;
};

export const ContentCollectionsSection: FC<SectionProps> = ({ content }) => {
    const { onLayout, visible } = useVisibleOnce();

    return (
        <ContentCollections
            contentType={content.data_type}
            slug={content.slug}
            enabled={visible}
            onLayout={onLayout}
        />
    );
};

export default ContentCollections;
