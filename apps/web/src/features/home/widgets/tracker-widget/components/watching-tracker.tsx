import { useCallback, useEffect, useRef, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    ContentStatusEnum,
    ContentTypeEnum,
    type WatchArgs,
    WatchStatusEnum,
    watchAddMutation,
} from '@hikka/api';
import {
    carryOverWatchArgs,
    EPISODE_FORMS,
    getDeclensionWord,
    getMediaTypeLabel,
    getTitle,
} from '@hikka/core';

import StatusWatching from '@/components/icons/list-status/StatusWatching';
import { ListEntryEditDialog } from '@/components/tracking';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { DEBOUNCE_MS, useDebounce } from '@/services/hooks/use-debounce';
import { useSession, useSessionUI } from '@/services/session';
import {
    invalidateWatchState,
    writeWatchToCaches,
} from '@/utils/api/invalidate-content-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { Link, useRouter } from '@/utils/navigation';

import { homeWatchingOptions } from '../../../queries';
import ProgressTrackerSkeleton from './progress-tracker-skeleton';
import ProgressTrackerView from './progress-tracker-view';

type PendingWatch = {
    slug: string;
    total: number | null;
    args: WatchArgs;
};

type WatchingTrackerProps = {
    hideOngoings?: boolean;
    onClearHideOngoings?: () => void;
};

const WatchingTracker = ({
    hideOngoings = false,
    onClearHideOngoings,
}: WatchingTrackerProps) => {
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const { preferences } = useSessionUI();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [pending, setPending] = useState<PendingWatch | null>(null);

    const {
        list,
        ref,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isFetchNextPageError,
        isPending,
    } = useInfiniteList(homeWatchingOptions(String(loggedUser?.username)), {
        enabled: Boolean(loggedUser?.username),
    });

    const filteredList = hideOngoings
        ? list?.filter(
              (item) => item.anime.status !== ContentStatusEnum.ONGOING,
          )
        : list;

    const selectedWatch =
        filteredList?.find((item) => item.anime.slug === selectedSlug) ||
        filteredList?.[0];

    const isSkippingHidden =
        filteredList?.length === 0 &&
        !isFetchNextPageError &&
        (hasNextPage || isFetchingNextPage);

    useEffect(() => {
        if (isSkippingHidden && !isFetchingNextPage) fetchNextPage();
    }, [isSkippingHidden, isFetchingNextPage, fetchNextPage]);

    const [debouncedPending] = useDebounce({
        value: pending,
        delay: DEBOUNCE_MS.commit,
    });

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

    if (isPending || isSkippingHidden) {
        return <ProgressTrackerSkeleton />;
    }

    if (!filteredList || filteredList.length === 0) {
        if (list && list.length > 0) {
            return (
                <EmptyState
                    icon={<StatusWatching />}
                    title="Усі тайтли - онґоїнґи"
                    description="У списку Дивлюсь лише онґоїнґи, які зараз приховано"
                    action={
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={onClearHideOngoings}
                        >
                            Показати онґоїнґи
                        </Button>
                    }
                />
            );
        }

        return (
            <EmptyState
                icon={<StatusWatching />}
                title={
                    <span>
                        Список <span className="font-extrabold">Дивлюсь</span>{' '}
                        порожній
                    </span>
                }
                description="Додайте аніме у список Дивлюсь"
                action={
                    <Button
                        variant="secondary"
                        size="md"
                        render={<Link to="/anime" />}
                    >
                        Знайти аніме
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
            items={filteredList.map((item) => ({
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
                          mediaTypeLabel: getMediaTypeLabel(
                              selectedWatch.anime.media_type,
                          ),
                          total: totalEpisodes ?? undefined,
                          totalDeclension: totalEpisodes
                              ? getDeclensionWord(totalEpisodes, EPISODE_FORMS)
                              : undefined,
                          current: currentEpisodes,
                          progressUnit: EPISODE_FORMS[2],
                          addUnitLabel: EPISODE_FORMS[0],
                          onAdd: handleAddEpisode,
                          onRemove: handleRemoveEpisode,
                          onOpenEdit: openWatchEditModal,
                      }
                    : undefined
            }
            editModal={
                selectedWatch ? (
                    <ListEntryEditDialog
                        open={open}
                        onOpenChange={setOpen}
                        content={selectedWatch.anime}
                        slug={selectedWatch.anime.slug}
                        contentType={ContentTypeEnum.ANIME}
                        watch={selectedWatch}
                    />
                ) : undefined
            }
        />
    );
};

export default WatchingTracker;
