import { type FC, useMemo, useRef } from 'react';

import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Platform, View } from 'react-native';

import {
    type CollectionResponse,
    FavouriteContentTypeEnum,
    VoteContentTypeEnum,
} from '@hikka/api';
import { formatTimeAgo } from '@hikka/core';

import AuthorRow from '@/components/author-row';
import DetailHeaderChrome from '@/components/detail-header-chrome';
import { FavouriteButton } from '@/components/favourite';
import { MDViewer } from '@/components/markdown';
import TextExpand from '@/components/text-expand';
import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { StatItem } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { useTitleOnScroll } from '@/components/use-title-on-scroll';
import VoteButton from '@/components/vote-button';
import { isNotFoundError } from '@/utils/api/is-not-found';

import CollectionBadges from './collection-badges';
import CollectionEntry from './collection-entry';
import {
    COLLECTION_COLUMNS,
    type CollectionRow,
    collectionRows,
    groupCollection,
} from './collection-rows';
import CollectionSkeleton from './collection-skeleton';
import CollectionCommentsSlot from './comments-slot';
import { collectionOptions } from './queries';

const DESCRIPTION_LINES = 5;
const DESCRIPTION_TEXT_CLASS = 'text-base leading-6 text-foreground';
// The list's `pt-4`, so a header child's layout `y` maps to the scroll offset.
const LIST_TOP_PADDING = 16;
const TOC_ICON =
    Platform.OS === 'android'
        ? require('../../../assets/icons/toc.xml')
        : 'list.bullet';

type Item = { kind: 'header' } | CollectionRow | { kind: 'comments' };

type HeaderProps = {
    collection: CollectionResponse;
    onTitleBottom: (bottom: number) => void;
};

const CollectionHeader: FC<HeaderProps> = ({ collection, onTitleBottom }) => {
    const router = useRouter();

    return (
        <View className="gap-4 pb-6">
            <Card className="mb-2">
                <AuthorRow
                    username={collection.author.username}
                    avatar={collection.author.avatar}
                    meta={[formatTimeAgo(collection.updated, Date.now())]}
                />
            </Card>
            <Text
                accessibilityRole="header"
                onLayout={(event) => {
                    const { y, height } = event.nativeEvent.layout;
                    onTitleBottom(LIST_TOP_PADDING + y + height);
                }}
                className="font-bold text-2xl leading-8"
            >
                {collection.title}
            </Text>
            <CollectionBadges collection={collection} />
            {collection.description ? (
                <TextExpand
                    lines={DESCRIPTION_LINES}
                    textClassName={DESCRIPTION_TEXT_CLASS}
                    contentKey={collection.reference}
                >
                    <MDViewer key={collection.reference} selectable>
                        {collection.description}
                    </MDViewer>
                </TextExpand>
            ) : null}
            <View className="flex-row items-center gap-2">
                <VoteButton
                    contentType={VoteContentTypeEnum.COLLECTION}
                    slug={collection.reference}
                    myScore={collection.my_score}
                    voteScore={collection.vote_score}
                />
                <FavouriteButton
                    contentType={FavouriteContentTypeEnum.COLLECTION}
                    slug={collection.reference}
                />
                <StatItem
                    accessibilityLabel={`Коментарі: ${collection.comments_count}`}
                    onPress={() =>
                        router.push(
                            `/comments/collection/${collection.reference}`,
                        )
                    }
                >
                    <Icon as={MessageCircle} />
                    {collection.comments_count}
                </StatItem>
            </View>
        </View>
    );
};

type Props = {
    reference: string;
};

/** The web's collection page: author, title, badges, description, votes, then the grouped entries in a 3-column grid. */
const CollectionPage: FC<Props> = ({ reference }) => {
    const { data, error, isPending, refetch, isRefetching } = useQuery(
        collectionOptions(reference),
    );
    const listRef = useRef<FlashListRef<Item>>(null);
    const { titleVisible, onScroll, onTitleBottom } = useTitleOnScroll();

    const items = useMemo<Item[]>(
        () =>
            data
                ? [
                      { kind: 'header' },
                      ...collectionRows(groupCollection(data)),
                      { kind: 'comments' },
                  ]
                : [],
        [data],
    );
    const labels = items.flatMap((item, index) =>
        item.kind === 'label' ? [{ label: item.label, index }] : [],
    );

    return (
        <>
            <DetailHeaderChrome
                title={data?.title ?? ''}
                titleVisible={titleVisible}
                sharePath={data ? `/collections/${reference}` : undefined}
                actions={
                    labels.length > 0 ? (
                        <Stack.Toolbar.Menu
                            icon={TOC_ICON}
                            accessibilityLabel="Зміст"
                        >
                            {labels.map(({ label, index }) => (
                                <Stack.Toolbar.MenuAction
                                    key={index}
                                    onPress={() =>
                                        listRef.current?.scrollToIndex({
                                            index,
                                            animated: true,
                                        })
                                    }
                                >
                                    {label}
                                </Stack.Toolbar.MenuAction>
                            ))}
                        </Stack.Toolbar.Menu>
                    ) : undefined
                }
            />
            {isPending ? (
                <CollectionSkeleton />
            ) : error && !data ? (
                <ErrorState
                    error={error}
                    onRetry={refetch}
                    notFound={isNotFoundError(error)}
                />
            ) : data ? (
                <FlashList
                    ref={listRef}
                    className="bg-background"
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerClassName="px-4 pt-4 pb-8"
                    data={items}
                    keyExtractor={(item) =>
                        item.kind === 'header' || item.kind === 'comments'
                            ? item.kind
                            : item.key
                    }
                    getItemType={(item) => item.kind}
                    renderItem={({ item }) => {
                        switch (item.kind) {
                            case 'header':
                                return (
                                    <CollectionHeader
                                        collection={data}
                                        onTitleBottom={onTitleBottom}
                                    />
                                );
                            case 'label':
                                return (
                                    <Header className="pt-2 pb-3">
                                        <HeaderTitle size="subsection">
                                            {item.label}
                                        </HeaderTitle>
                                    </Header>
                                );
                            case 'entries':
                                return (
                                    <View className="-mx-1.5 flex-row pb-4">
                                        {Array.from(
                                            { length: COLLECTION_COLUMNS },
                                            (_, index) => {
                                                const entry = item.items[index];
                                                return (
                                                    <View
                                                        key={
                                                            entry?.content
                                                                .slug ??
                                                            `empty-${index}`
                                                        }
                                                        className="flex-1 px-1.5"
                                                    >
                                                        {entry && (
                                                            <CollectionEntry
                                                                item={entry}
                                                            />
                                                        )}
                                                    </View>
                                                );
                                            },
                                        )}
                                    </View>
                                );
                            case 'comments':
                                return (
                                    <CollectionCommentsSlot
                                        reference={reference}
                                        commentsCount={data.comments_count}
                                    />
                                );
                        }
                    }}
                    scrollEventThrottle={16}
                    onScroll={onScroll}
                    refreshing={isRefetching}
                    onRefresh={refetch}
                />
            ) : null}
        </>
    );
};

export default CollectionPage;
