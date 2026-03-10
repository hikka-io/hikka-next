'use client';

import { WatchArgs, WatchStatusEnum } from '@hikka/client';
import {
    useCreateWatch,
    useSearchUserWatches,
    useSession,
} from '@hikka/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';

import { WatchEditModal } from '@/features/watch';

import useDebounce from '@/services/hooks/use-debounce';
import { useModalContext } from '@/services/providers/modal-provider';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';

const EPISODES_DECLENSION: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];

const WatchingTracker = () => {
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [updatedWatch, setUpdatedWatch] = useState<WatchArgs | null>(null);

    const { list } = useSearchUserWatches({
        username: String(loggedUser?.username),
        args: {
            watch_status: WatchStatusEnum.WATCHING,
            sort: ['watch_updated:desc'],
        },
    });

    const selectedWatch =
        list?.find((item) => item.anime.slug === selectedSlug) || list?.[0];

    const debouncedUpdatedWatch = useDebounce({
        value: updatedWatch,
        delay: 500,
    });

    const { mutate: mutateCreateWatch, reset } = useCreateWatch();

    const handleSelectChange = (value: string[]) => {
        const slug = value[0];
        if (slug) {
            setSelectedSlug(slug);
            setUpdatedWatch(null);
        }
    };

    const openWatchEditModal = () => {
        if (!selectedWatch) return;

        openModal({
            content: (
                <WatchEditModal
                    watch={selectedWatch}
                    slug={selectedWatch.anime.slug}
                />
            ),
            className: '!max-w-xl',
            title: selectedWatch.anime.title,
            forceModal: true,
        });
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

        setUpdatedWatch({ ...selectedWatch, episodes });
    };

    useEffect(() => {
        reset();
    }, [selectedSlug, reset]);

    useEffect(() => {
        setUpdatedWatch(null);
    }, [selectedWatch]);

    useEffect(() => {
        if (debouncedUpdatedWatch && selectedWatch) {
            mutateCreateWatch({
                slug: selectedWatch.anime.slug,
                args: {
                    note: debouncedUpdatedWatch.note,
                    episodes: debouncedUpdatedWatch.episodes,
                    rewatches: debouncedUpdatedWatch.rewatches,
                    score: debouncedUpdatedWatch.score,
                    status: debouncedUpdatedWatch.status,
                },
            });
        }
    }, [mutateCreateWatch, debouncedUpdatedWatch]);

    if (!list || list.length === 0) {
        return (
            <NotFound
                title={
                    <span>
                        Список <span className="font-extrabold">Дивлюсь</span>{' '}
                        порожній
                    </span>
                }
                description="Додайте аніме у список Дивлюсь"
            />
        );
    }

    const currentEpisodes =
        updatedWatch?.episodes ?? selectedWatch?.episodes ?? 0;
    const totalEpisodes = selectedWatch?.anime.episodes_total;

    return (
        <div className="flex flex-col gap-4">
            {selectedWatch && (
                <Link
                    href={`/anime/${selectedWatch.anime.slug}`}
                    className="relative block overflow-hidden rounded-lg"
                >
                    <ContentCard
                        image={selectedWatch.anime.image}
                        className="aspect-video w-full"
                        containerClassName="rounded-lg"
                        containerRatio={16 / 9}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                        <p className="line-clamp-1 text-sm font-bold text-white">
                            {selectedWatch.anime.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
                            {selectedWatch.anime.year && (
                                <span>{selectedWatch.anime.year}</span>
                            )}
                            {selectedWatch.anime.media_type && (
                                <>
                                    <div className="size-1 rounded-full bg-white/70" />
                                    <span>
                                        {
                                            ANIME_MEDIA_TYPE[
                                                selectedWatch.anime.media_type
                                            ]?.title_ua
                                        }
                                    </span>
                                </>
                            )}
                            {totalEpisodes && (
                                <>
                                    <div className="size-1 rounded-full bg-white/70" />
                                    <span>
                                        {totalEpisodes}{' '}
                                        {getDeclensionWord(
                                            totalEpisodes,
                                            EPISODES_DECLENSION,
                                        )}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </Link>
            )}

            <Select
                value={selectedWatch ? [selectedWatch.anime.slug] : undefined}
                onValueChange={handleSelectChange}
            >
                <SelectTrigger size="md">
                    <span className="min-w-0 flex-1 truncate text-left">
                        {selectedWatch?.anime.title}
                    </span>
                    <SelectIcon />
                </SelectTrigger>
                <SelectContent className="w-56">
                    <SelectList>
                        <SelectGroup>
                            {list.map((item) => (
                                <SelectItem
                                    key={item.anime.slug}
                                    value={item.anime.slug}
                                >
                                    {item.anime.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>

            {selectedWatch && (
                <>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-bold text-foreground">
                                {currentEpisodes}
                            </span>
                            /{totalEpisodes ?? '?'}{' '}
                            {getDeclensionWord(
                                totalEpisodes ?? 0,
                                EPISODES_DECLENSION,
                            )}
                        </p>
                        <Progress
                            className="h-2"
                            value={currentEpisodes}
                            max={totalEpisodes ?? currentEpisodes}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon-md"
                            onClick={openWatchEditModal}
                        >
                            <MaterialSymbolsSettingsOutlineRounded />
                        </Button>
                        <div className="flex flex-1">
                            <Button
                                className="flex-1 rounded-r-none"
                                onClick={handleAddEpisode}
                                variant="secondary"
                                size="md"
                            >
                                <MaterialSymbolsAddRounded />
                                Додати епізод
                            </Button>
                            <Button
                                className="rounded-l-none"
                                onClick={handleRemoveEpisode}
                                variant="secondary"
                                size="icon-md"
                            >
                                <MaterialSymbolsRemoveRounded />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default WatchingTracker;
