import { useCallback, useEffect, useRef, useState } from 'react';

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
import { carryOverWatchArgs } from '@/utils/api/tracking-args';
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

type PendingWatch = {
    slug: string;
    total: number | null;
    args: WatchArgs;
};

const WatchingTracker = () => {
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const { preferences } = useSessionUI();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [pending, setPending] = useState<PendingWatch | null>(null);

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

    const [debouncedPending] = useDebounce({ value: pending, delay: 500 });

    const invalidateWatchLists = useCallback(
        (refetch: boolean) => invalidateWatchState(queryClient, { refetch }),
        [queryClient],
    );

    const { mutate: mutateCreateWatch } = useMutation({
        ...watchAddMutation(),
        onSuccess: (data) => {
            writeWatchToCaches(queryClient, data);
        },
    });

    const pendingFor = (slug: string) =>
        pending?.slug === slug ? pending : null;

    const handleSelect = (slug: string) => {
        if (slug === selectedWatch?.anime.slug) {
            router.push(`/anime/${slug}`);
            return;
        }

        setSelectedSlug(slug);
    };

    const openWatchEditModal = () => {
        if (!selectedWatch) return;
        setOpen(true);
    };

    const buildArgs = (
        watch: NonNullable<typeof selectedWatch>,
        episodes: number,
    ): WatchArgs => ({
        ...carryOverWatchArgs(watch),
        episodes,
        status:
            watch.anime.episodes_total != null &&
            episodes === watch.anime.episodes_total
                ? WatchStatusEnum.COMPLETED
                : WatchStatusEnum.WATCHING,
    });

    const handleAddEpisode = () => {
        if (!selectedWatch) return;

        const slug = selectedWatch.anime.slug;
        const total = selectedWatch.anime.episodes_total;
        const episodes =
            (pendingFor(slug)?.args.episodes ?? selectedWatch.episodes) + 1;

        if (total && episodes > total) return;

        setPending({ slug, total, args: buildArgs(selectedWatch, episodes) });
    };

    const handleRemoveEpisode = () => {
        if (!selectedWatch) return;

        const slug = selectedWatch.anime.slug;
        const episodes =
            (pendingFor(slug)?.args.episodes ?? selectedWatch.episodes) - 1;

        if (episodes < 0) return;

        setPending({
            slug,
            total: selectedWatch.anime.episodes_total,
            args: buildArgs(selectedWatch, episodes),
        });
    };

    const sentRef = useRef<PendingWatch | null>(null);

    useEffect(() => {
        if (!debouncedPending || debouncedPending === sentRef.current) return;
        sentRef.current = debouncedPending;

        const { slug, total, args } = debouncedPending;

        mutateCreateWatch(
            {
                path: { slug },
                body: args,
            },
            // Skip the immediate list refetch on the final episode so the
            // entry doesn't reorder/vanish mid-interaction.
            { onSuccess: () => invalidateWatchLists(args.episodes !== total) },
        );
    }, [debouncedPending, mutateCreateWatch, invalidateWatchLists]);

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

    const selectedPending = selectedWatch
        ? pendingFor(selectedWatch.anime.slug)
        : null;
    const currentEpisodes =
        selectedPending?.args.episodes ?? selectedWatch?.episodes ?? 0;
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
