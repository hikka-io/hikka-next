'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { type WatchArgs, WatchStatusEnum } from '@hikka/client';
import {
    useCreateWatch,
    useHikkaClient,
    useSearchUserWatches,
    useSession,
} from '@hikka/react';
import { getTitle } from '@hikka/react/utils';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import { WatchEditModal } from '@/features/watch';
import useDebounce from '@/services/hooks/use-debounce';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { useRouter } from '@/utils/navigation';

import ProgressTrackerView, {
    ProgressTrackerMeta,
} from './progress-tracker-view';

const EPISODES_DECLENSION: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];

type AnimeWatchlistProps = {};

const AnimeWatchlist: React.FC<AnimeWatchlistProps> = () => {
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const { defaultOptions } = useHikkaClient();
    const [open, setOpen] = useState(false);
    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [updatedWatch, setUpdatedWatch] = useState<WatchArgs | null>(null);

    const { list, isLoading } = useSearchUserWatches({
        username: String(loggedUser?.username),
        args: {
            watch_status: WatchStatusEnum.WATCHING,
            sort: ['watch_updated:desc'],
        },
    });

    const selectedWatch =
        list?.find((item) => item.anime.slug === selectedSlug) || list?.[0];

    // Anime keeps its own debounced optimistic-update strategy: episode +/-
    // mutate local state immediately and the API call is debounced.
    const deboucedUpdatedWatch = useDebounce({
        value: updatedWatch,
        delay: 500,
    });
    const { mutate: mutateCreateWatch, reset } = useCreateWatch();

    const handleSelect = (slug: string) => {
        if (slug === selectedWatch?.anime.slug) {
            router.push(`/anime/${slug}`);
            return;
        }

        setSelectedSlug(slug);
        setUpdatedWatch(null);
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
        });
    };

    const handleRemoveEpisode = () => {
        if (!selectedWatch) return;

        const episodes = (updatedWatch?.episodes ?? selectedWatch.episodes) - 1;

        if (episodes < 0) return;

        setUpdatedWatch({
            ...selectedWatch,
            episodes,
        });
    };

    useEffect(() => {
        reset();
    }, [selectedSlug]);

    useEffect(() => {
        setUpdatedWatch(null);
    }, [selectedWatch]);

    useEffect(() => {
        if (deboucedUpdatedWatch) {
            mutateCreateWatch({
                slug: selectedWatch!.anime.slug,
                args: {
                    note: deboucedUpdatedWatch.note,
                    episodes: deboucedUpdatedWatch.episodes,
                    rewatches: deboucedUpdatedWatch.rewatches,
                    score: deboucedUpdatedWatch.score,
                    status: deboucedUpdatedWatch.status,
                },
            });
        }
    }, [mutateCreateWatch, deboucedUpdatedWatch]);

    const selectedTitle = selectedWatch
        ? getTitle(
              selectedWatch.anime,
              defaultOptions?.title,
              defaultOptions?.name,
          )
        : '';

    return (
        <ProgressTrackerView
            isLoading={isLoading}
            isEmpty={list?.length === 0}
            emptyTitle={
                <span>
                    Список <span className="font-extrabold">Дивлюсь</span>{' '}
                    порожній
                </span>
            }
            emptyDescription="Додайте аніме у список Дивлюсь, щоб відстежувати їх прогрес"
            items={(list ?? []).map((item) => ({
                slug: item.anime.slug,
                image: item.anime.image,
                title: getTitle(
                    item.anime,
                    defaultOptions?.title,
                    defaultOptions?.name,
                ),
            }))}
            selected={
                selectedWatch && {
                    slug: selectedWatch.anime.slug,
                    href: `/anime/${selectedWatch.anime.slug}`,
                    title: selectedTitle,
                    details: (
                        <ProgressTrackerMeta
                            year={selectedWatch.anime.year}
                            mediaTypeLabel={
                                selectedWatch.anime.media_type
                                    ? ANIME_MEDIA_TYPE[
                                          selectedWatch.anime.media_type
                                      ].title_ua
                                    : undefined
                            }
                            total={selectedWatch.anime.episodes_total}
                            totalWord={
                                selectedWatch.anime.episodes_total
                                    ? getDeclensionWord(
                                          selectedWatch.anime.episodes_total,
                                          EPISODES_DECLENSION,
                                      )
                                    : undefined
                            }
                        />
                    ),
                    current:
                        updatedWatch?.episodes ?? selectedWatch.episodes ?? 0,
                    total: selectedWatch.anime.episodes_total ?? undefined,
                    unitLabel: 'епізодів',
                    actionUnit: 'епізод',
                }
            }
            onSelect={handleSelect}
            onAdd={handleAddEpisode}
            onRemove={handleRemoveEpisode}
            onOpenSettings={() => selectedWatch && setOpen(true)}
            modal={
                selectedWatch && (
                    <ResponsiveModal
                        open={open}
                        onOpenChange={setOpen}
                        forceDesktop
                    >
                        <ResponsiveModalContent className="md:max-w-xl">
                            <ResponsiveModalHeader>
                                <ResponsiveModalTitle>
                                    {selectedTitle}
                                </ResponsiveModalTitle>
                            </ResponsiveModalHeader>
                            <WatchEditModal
                                watch={selectedWatch}
                                slug={selectedWatch.anime.slug}
                                onClose={() => setOpen(false)}
                            />
                        </ResponsiveModalContent>
                    </ResponsiveModal>
                )
            }
        />
    );
};

export default AnimeWatchlist;
