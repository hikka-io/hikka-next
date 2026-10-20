import type { FC } from 'react';

import { useMutationState, useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
    animeSlugOptions,
    ContentTypeEnum,
    type MainContentTypeEnum,
    mangaInfoOptions,
    searchAnimeOptions,
} from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import { IconStatusButton, ListStatusButton } from '@/components/tracking';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';
import { useTitle } from '@/services/session';

const ANIME = 'sousou-no-frieren-ad4e3e';
const MANGA = 'sousou-no-frieren-97e05f';
const MANGA_WITH_TOTALS =
    'sousou-no-frieren-anthology-kotonaru-tabi-wo-tanoshimu-mahou-73c061';

type SampleProps = {
    contentType: MainContentTypeEnum;
    slug: string;
    title: string;
    image?: string | null;
    totals?: {
        episodes_total?: number | null;
        chapters?: number | null;
        volumes?: number | null;
    };
};

const Sample: FC<SampleProps> = ({
    contentType,
    slug,
    title,
    image,
    totals,
}) => (
    <Card className="flex-row gap-4">
        <View className="w-24">
            <PosterCard
                image={image ?? undefined}
                overlay={
                    <View className="absolute right-0 bottom-0">
                        <IconStatusButton
                            contentType={contentType}
                            slug={slug}
                        />
                    </View>
                }
            />
        </View>
        <View className="flex-1 gap-2">
            <Text numberOfLines={2} className="font-semibold text-base">
                {title}
            </Text>
            <Text className="text-muted-foreground text-xs">
                {contentType} · {slug}
            </Text>
            <ListStatusButton
                contentType={contentType}
                slug={slug}
                content={totals}
            />
        </View>
    </Card>
);

// The controls fed by a list response, as catalog cards are: `entry` comes from `item.watch`,
// so a stale per-title cache can disagree with it (DESIGN.md section 12, entry states).
const EmbeddedSample: FC = () => {
    const list = useQuery(
        searchAnimeOptions({ body: { query: 'frieren' }, query: { size: 5 } }),
    );
    const item = list.data?.list.find((anime) => anime.slug === ANIME);
    const entry = item ? (item.watch?.[0] ?? null) : undefined;

    return (
        <Card className="flex-row gap-4">
            <View className="w-24">
                <PosterCard
                    image={item?.image ?? undefined}
                    overlay={
                        entry !== undefined && (
                            <View className="absolute right-0 bottom-0">
                                <IconStatusButton
                                    contentType={ContentTypeEnum.ANIME}
                                    slug={ANIME}
                                    entry={entry}
                                />
                            </View>
                        )
                    }
                />
            </View>
            <View className="flex-1 gap-2">
                <Text className="font-semibold text-base">
                    Embedded entry (search list)
                </Text>
                <Text className="text-muted-foreground text-xs">
                    list says:{' '}
                    {entry === undefined
                        ? '…'
                        : entry
                          ? entry.status
                          : 'untracked'}
                </Text>
                {entry !== undefined && (
                    <ListStatusButton
                        contentType={ContentTypeEnum.ANIME}
                        slug={ANIME}
                        entry={entry}
                        content={item}
                    />
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onPress={() => void list.refetch()}
                >
                    Refetch list
                </Button>
            </View>
        </Card>
    );
};

// Dev-only: the tracking controls against real titles, plus the bodies the last writes sent.
const TrackingDev: FC = () => {
    const getTitle = useTitle();
    const { user, hasToken } = useSession();
    const anime = useQuery(animeSlugOptions({ path: { slug: ANIME } }));
    const manga = useQuery(mangaInfoOptions({ path: { slug: MANGA } }));
    const mangaWithTotals = useQuery(
        mangaInfoOptions({ path: { slug: MANGA_WITH_TOTALS } }),
    );
    // Only tracking writes: the login mutation's variables carry the password.
    const writes = useMutationState({
        filters: { mutationKey: ['list-entry'] },
        select: (mutation) => ({
            at: mutation.state.submittedAt,
            status: mutation.state.status,
            variables: mutation.state.variables,
        }),
    });

    return (
        <ScrollView
            className="bg-background"
            contentContainerClassName="gap-4 p-4"
            contentInsetAdjustmentBehavior="automatic"
        >
            <Text className="text-muted-foreground text-sm">
                {hasToken
                    ? `Signed in as ${user?.username ?? '…'}`
                    : 'Signed out'}
            </Text>
            <Sample
                contentType={ContentTypeEnum.ANIME}
                slug={ANIME}
                title={anime.data ? getTitle(anime.data) : ANIME}
                image={anime.data?.image}
                totals={anime.data}
            />
            <Sample
                contentType={ContentTypeEnum.MANGA}
                slug={MANGA}
                title={manga.data ? getTitle(manga.data) : MANGA}
                image={manga.data?.image}
                totals={manga.data}
            />
            <Sample
                contentType={ContentTypeEnum.MANGA}
                slug={MANGA_WITH_TOTALS}
                title={
                    mangaWithTotals.data
                        ? getTitle(mangaWithTotals.data)
                        : MANGA_WITH_TOTALS
                }
                image={mangaWithTotals.data?.image}
                totals={mangaWithTotals.data}
            />
            <EmbeddedSample />
            <Sample
                // An invalid read content type answers 422: the entry is unreadable, never "untracked".
                contentType={'characters' as MainContentTypeEnum}
                slug={MANGA}
                title="Error state (entry read fails with 422)"
            />
            <Card variant="inset" className="gap-2">
                <Text className="font-semibold text-sm">
                    Last tracking writes
                </Text>
                {writes
                    .slice(-4)
                    .reverse()
                    .map((write) => (
                        <Text
                            key={write.at}
                            selectable
                            className="font-mono text-xs"
                        >
                            {write.status} {JSON.stringify(write.variables)}
                        </Text>
                    ))}
            </Card>
        </ScrollView>
    );
};

const TrackingDevScreen: FC = () => {
    if (!__DEV__) return <Redirect href="/" />;
    return <TrackingDev />;
};

export default TrackingDevScreen;
