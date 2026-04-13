'use client';

import { WatchArgs, WatchStatusEnum } from '@hikka/client';
import {
    useCreateWatch,
    useHikkaClient,
    useSearchUserWatches,
    useSession,
} from '@hikka/react';
import { getTitle } from '@hikka/react/utils';
import { useEffect, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { WatchEditModal } from '@/features/watch';

import useDebounce from '@/services/hooks/use-debounce';
import { cn } from '@/utils/cn';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useRouter } from '@/utils/navigation';

const EPISODES_DECLENSION: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];

const WatchingTracker = () => {
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const { defaultOptions } = useHikkaClient();
    const [open, setOpen] = useState(false);

    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [updatedWatch, setUpdatedWatch] = useState<WatchArgs | null>(null);

    const { list, ref, isFetchingNextPage } = useSearchUserWatches({
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
        <>
            <div className="flex flex-col gap-4">
                <Stack
                    visibleScrollbar
                    className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4"
                    imagePreset="cardXs"
                >
                    {list.map((item) => (
                        <Tooltip key={item.anime.slug}>
                            <TooltipTrigger asChild>
                                <ContentCard
                                    onClick={() =>
                                        handleSelect(item.anime.slug)
                                    }
                                    image={item.anime.image}
                                    containerClassName="rounded-(--base-radius)"
                                    className={cn(
                                        'transition-opacity',
                                        selectedWatch?.anime.slug !==
                                            item.anime.slug &&
                                            'opacity-30 hover:opacity-60',
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-48 truncate">
                                {getTitle(
                                    item.anime,
                                    defaultOptions?.title,
                                    defaultOptions?.name,
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    <div ref={ref} className="flex items-center justify-center">
                        {isFetchingNextPage && (
                            <span className="loading loading-spinner" />
                        )}
                    </div>
                </Stack>

                {selectedWatch && (
                    <>
                        <Link
                            className="w-fit flex-1"
                            to={`/anime/${selectedWatch.anime.slug}`}
                        >
                            <h5>
                                {getTitle(
                                    selectedWatch.anime,
                                    defaultOptions?.title,
                                    defaultOptions?.name,
                                )}
                            </h5>
                            <div className="mt-1 flex cursor-pointer items-center gap-2">
                                {selectedWatch.anime.year && (
                                    <Label className="text-muted-foreground cursor-pointer text-xs">
                                        {selectedWatch.anime.year}
                                    </Label>
                                )}
                                {selectedWatch.anime.media_type && (
                                    <>
                                        <div className="bg-muted-foreground size-1 rounded-full" />
                                        <Label className="text-muted-foreground cursor-pointer text-xs">
                                            {
                                                ANIME_MEDIA_TYPE[
                                                    selectedWatch.anime
                                                        .media_type
                                                ]?.title_ua
                                            }
                                        </Label>
                                    </>
                                )}
                                {totalEpisodes && (
                                    <>
                                        <div className="bg-muted-foreground size-1 rounded-full" />
                                        <Label className="text-muted-foreground cursor-pointer text-xs">
                                            {totalEpisodes}{' '}
                                            {getDeclensionWord(
                                                totalEpisodes,
                                                EPISODES_DECLENSION,
                                            )}
                                        </Label>
                                    </>
                                )}
                            </div>
                        </Link>

                        <div className="flex w-full flex-col gap-2">
                            <p className="text-muted-foreground text-sm">
                                <span className="text-foreground font-bold">
                                    {currentEpisodes}
                                </span>
                                /{totalEpisodes ?? '?'} епізодів
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
                                className="shrink-0"
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
                                    <div className="flex gap-1">
                                        <span className="hidden sm:block">
                                            Додати
                                        </span>
                                        <span className="capitalize sm:normal-case">
                                            епізод
                                        </span>
                                    </div>
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
            {selectedWatch && (
                <ResponsiveModal
                    open={open}
                    onOpenChange={setOpen}
                    forceDesktop
                >
                    <ResponsiveModalContent className="md:max-w-xl">
                        <ResponsiveModalHeader>
                            <ResponsiveModalTitle>
                                {getTitle(
                                    selectedWatch.anime,
                                    defaultOptions?.title,
                                    defaultOptions?.name,
                                )}
                            </ResponsiveModalTitle>
                        </ResponsiveModalHeader>
                        <WatchEditModal
                            watch={selectedWatch}
                            slug={selectedWatch.anime.slug}
                            onClose={() => setOpen(false)}
                        />
                    </ResponsiveModalContent>
                </ResponsiveModal>
            )}
        </>
    );
};

export default WatchingTracker;
