import { useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    userWatchListInfiniteOptions,
    type WatchArgs,
    WatchStatusEnum,
    watchAddMutation,
} from '@hikka/api';

import { WatchEditModal } from '@/components/action-buttons';
import Watching from '@/components/icons/watch-status/watching';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { useSession } from '@/features/auth/hooks/use-session';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import useDebounce from '@/services/hooks/use-debounce';
import {
    invalidateWatchState,
    writeWatchToCaches,
} from '@/utils/api/invalidate-content-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useRouter } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

import ProgressTrackerView from './progress-tracker-view';

const EPISODES_DECLENSION: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];

const WatchingTracker = () => {
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const { preferences } = useSessionUI();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [updatedWatch, setUpdatedWatch] = useState<WatchArgs | null>(null);

    const { list, ref, isFetchingNextPage, hasNextPage } = useInfiniteList(
        userWatchListInfiniteOptions({
            path: { username: String(loggedUser?.username) },
            body: {
                watch_status: WatchStatusEnum.WATCHING,
                sort: ['watch_updated:desc'],
            },
        }),
        { enabled: Boolean(loggedUser?.username) },
    );

    const selectedWatch =
        list?.find((item) => item.anime.slug === selectedSlug) || list?.[0];

    const debouncedUpdatedWatch = useDebounce({
        value: updatedWatch,
        delay: 500,
    });

    const invalidateWatchLists = (refetch: boolean) =>
        invalidateWatchState(queryClient, { refetch });

    const { mutate: mutateCreateWatch, reset } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            writeWatchToCaches(queryClient, data);
        },
    });

    const handleSelect = (slug: string) => {
        if (slug === selectedWatch?.anime.slug) {
            router.push(`/anime/${slug}`);
            return;
        }

        setSelectedSlug(slug);
        setUpdatedWatch(null);
    };

    const openWatchEditModal = () => {
        if (!selectedWatch) return;
        setOpen(true);
    };

    const handleAddEpisode = () => {
        if (!selectedWatch) return;

        const episodes = (updatedWatch?.episodes ?? selectedWatch.episodes) + 1;

        if (
            selectedWatch.anime.episodes_total &&
            episodes > selectedWatch.anime.episodes_total
        )
            return;

        setUpdatedWatch({
            ...selectedWatch,
            status:
                episodes === selectedWatch.anime.episodes_total
                    ? WatchStatusEnum.COMPLETED
                    : WatchStatusEnum.WATCHING,
            episodes,
        } as WatchArgs);
    };

    const handleRemoveEpisode = () => {
        if (!selectedWatch) return;

        const episodes = (updatedWatch?.episodes ?? selectedWatch.episodes) - 1;

        if (episodes < 0) return;

        setUpdatedWatch({ ...selectedWatch, episodes } as WatchArgs);
    };

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        setUpdatedWatch(null);
    }, []);

    useEffect(() => {
        if (debouncedUpdatedWatch && selectedWatch) {
            const totalEpisodes = selectedWatch.anime.episodes_total;
            const isLastEpisode =
                totalEpisodes != null &&
                debouncedUpdatedWatch.episodes === totalEpisodes;

            mutateCreateWatch(
                {
                    path: { slug: selectedWatch.anime.slug },
                    body: {
                        note: debouncedUpdatedWatch.note,
                        episodes: debouncedUpdatedWatch.episodes,
                        rewatches: debouncedUpdatedWatch.rewatches,
                        score: debouncedUpdatedWatch.score,
                        status: debouncedUpdatedWatch.status,
                    },
                },
                // Skip the immediate list refetch on the final episode so the
                // entry doesn't reorder/vanish mid-interaction.
                { onSuccess: () => invalidateWatchLists(!isLastEpisode) },
            );
        }
    }, [
        mutateCreateWatch,
        debouncedUpdatedWatch,
        invalidateWatchLists,
        selectedWatch,
    ]);

    if (!list || list.length === 0) {
        return (
            <EmptyState
                icon={<Watching />}
                title={
                    <span>
                        Список <span className="font-extrabold">Дивлюсь</span>{' '}
                        порожній
                    </span>
                }
                description="Додайте аніме у список Дивлюсь"
                action={
                    <Button variant="secondary" size="md" asChild>
                        <Link to="/anime">Знайти аніме</Link>
                    </Button>
                }
            />
        );
    }

    const currentEpisodes =
        updatedWatch?.episodes ?? selectedWatch?.episodes ?? 0;
    const totalEpisodes = selectedWatch?.anime.episodes_total;

    return (
        <ProgressTrackerView
            items={list.map((item) => ({
                slug: item.anime.slug,
                image: item.anime.image,
                title: getTitle(
                    item.anime,
                    preferences.title_language,
                    preferences.name_language,
                ),
                isSelected: selectedWatch?.anime.slug === item.anime.slug,
                onSelect: () => handleSelect(item.anime.slug),
            }))}
            listRef={ref}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            selected={
                selectedWatch
                    ? {
                          href: `/anime/${selectedWatch.anime.slug}`,
                          title: getTitle(
                              selectedWatch.anime,
                              preferences.title_language,
                              preferences.name_language,
                          ),
                          year: selectedWatch.anime.year,
                          mediaTypeLabel: selectedWatch.anime.media_type
                              ? ANIME_MEDIA_TYPE[
                                    selectedWatch.anime
                                        .media_type as keyof typeof ANIME_MEDIA_TYPE
                                ]?.title_ua
                              : undefined,
                          total: totalEpisodes ?? undefined,
                          totalDeclension: totalEpisodes
                              ? getDeclensionWord(
                                    totalEpisodes,
                                    EPISODES_DECLENSION,
                                )
                              : undefined,
                          current: currentEpisodes,
                          progressUnit: 'епізодів',
                          addUnitLabel: 'епізод',
                          onAdd: handleAddEpisode,
                          onRemove: handleRemoveEpisode,
                          onOpenEdit: openWatchEditModal,
                      }
                    : undefined
            }
            editModal={
                selectedWatch
                    ? {
                          open,
                          onOpenChange: setOpen,
                          title: getTitle(
                              selectedWatch.anime,
                              preferences.title_language,
                              preferences.name_language,
                          ),
                          children: (
                              <WatchEditModal
                                  watch={selectedWatch}
                                  slug={selectedWatch.anime.slug}
                                  onClose={() => setOpen(false)}
                              />
                          ),
                      }
                    : undefined
            }
        />
    );
};

export default WatchingTracker;
