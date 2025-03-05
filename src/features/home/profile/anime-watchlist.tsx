'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import WatchEditModal from '@/features/modals/watch-edit-modal.component';

import { Params as AddWatchParams } from '@/services/api/watch/addWatch';
import useSession from '@/services/hooks/auth/use-session';
import useDebounce from '@/services/hooks/use-debounce';
import useAddWatch from '@/services/hooks/watch/use-add-watch';
import useWatchList from '@/services/hooks/watch/use-watch-list';
import { useModalContext } from '@/services/providers/modal-provider';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';
import { cn } from '@/utils/utils';

const EPISODES_DECLENSION: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];

interface AnimeWatchlistProps {}

const AnimeWatchlist: React.FC<AnimeWatchlistProps> = () => {
    // Hooks and Context
    const router = useRouter();
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

    // State Management
    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [updatedWatch, setUpdatedWatch] = useState<AddWatchParams | null>(
        null,
    );

    // Fetch Watchlist
    const { list } = useWatchList({
        username: String(loggedUser?.username),
        watch_status: 'watching',
        sort: ['watch_updated:desc'],
    });

    // Derived State
    const selectedWatch =
        list?.find((item) => item.anime.slug === selectedSlug) || list?.[0];

    // Hooks
    const deboucedUpdatedWatch = useDebounce({
        value: updatedWatch,
        delay: 500,
    });
    const { mutate: mutateAddWatch, reset } = useAddWatch();

    // Event Handlers
    const handleSelect = (slug: string) => {
        if (slug === selectedSlug) {
            router.push(`/anime/${slug}`);
            return;
        }

        setSelectedSlug(slug);
        setUpdatedWatch(null);
    };

    const openWatchEditModal = () => {
        if (selectedWatch) {
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
        }
    };

    const handleAddEpisode = () => {
        if (!selectedWatch) return;

        const episodes = (updatedWatch?.episodes ?? selectedWatch.episodes) + 1;

        // Prevent exceeding total episodes
        if (
            selectedWatch.anime.episodes_total &&
            episodes > selectedWatch.anime.episodes_total
        )
            return;

        setUpdatedWatch({
            ...selectedWatch,
            status:
                episodes === selectedWatch.anime.episodes_total
                    ? 'completed'
                    : 'watching',
            slug: selectedWatch.anime.slug,
            episodes,
        });
    };

    const handleRemoveEpisode = () => {
        if (!selectedWatch) return;

        const episodes = (updatedWatch?.episodes ?? selectedWatch.episodes) - 1;

        if (episodes < 0) return;

        setUpdatedWatch({
            ...selectedWatch,
            slug: selectedWatch.anime.slug,
            episodes,
        });
    };

    // Side Effects
    useEffect(() => {
        reset();
    }, [selectedSlug]);

    useEffect(() => {
        setUpdatedWatch(null);
    }, [selectedWatch]);

    useEffect(() => {
        if (deboucedUpdatedWatch) {
            mutateAddWatch({ params: deboucedUpdatedWatch });
        }
    }, [mutateAddWatch, deboucedUpdatedWatch]);

    // Rendering Helper: Anime Details
    const renderAnimeDetails = () => {
        if (!selectedWatch) return null;

        return (
            <div className="mt-1 flex cursor-pointer items-center gap-2">
                {selectedWatch.anime.year && (
                    <Label className="cursor-pointer text-xs text-muted-foreground">
                        {selectedWatch.anime.year}
                    </Label>
                )}
                {selectedWatch.anime.media_type && (
                    <>
                        <div className="size-1 rounded-full bg-muted-foreground" />
                        <Label className="cursor-pointer text-xs text-muted-foreground">
                            {
                                ANIME_MEDIA_TYPE[selectedWatch.anime.media_type]
                                    .title_ua
                            }
                        </Label>
                    </>
                )}
                {selectedWatch.anime.episodes_total && (
                    <>
                        <div className="size-1 rounded-full bg-muted-foreground" />
                        <Label className="cursor-pointer text-xs text-muted-foreground">
                            {selectedWatch.anime.episodes_total}{' '}
                            {getDeclensionWord(
                                selectedWatch.anime.episodes_total,
                                EPISODES_DECLENSION,
                            )}
                        </Label>
                    </>
                )}
            </div>
        );
    };

    // Rendering Helper: Buttons
    const renderActionButtons = () => (
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="md" onClick={openWatchEditModal}>
                <MaterialSymbolsSettingsOutlineRounded />
                Налаштування
            </Button>
            <div className="flex">
                <Button
                    className="flex-1 rounded-r-none"
                    onClick={handleAddEpisode}
                    variant="secondary"
                    size="md"
                >
                    <MaterialSymbolsAddRounded />
                    <div className="flex gap-1">
                        <span className="hidden sm:block">Додати</span>
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
    );

    // Main Render
    return (
        <>
            {list?.length === 0 && (
                <NotFound
                    title={
                        <span>
                            Список{' '}
                            <span className="font-extrabold">Дивлюсь</span>{' '}
                            порожній
                        </span>
                    }
                    description="Додайте аніме у список Дивлюсь, щоб відстежувати їх прогрес"
                />
            )}
            {list && list.length > 0 && (
                <Card className="h-full">
                    <Stack className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4">
                        {list.map((item) => (
                            <Tooltip key={item.anime.slug}>
                                <TooltipTrigger asChild>
                                    <ContentCard
                                        onClick={() =>
                                            handleSelect(item.anime.slug)
                                        }
                                        image={item.anime.image}
                                        className={cn(
                                            'transition-opacity',
                                            selectedWatch?.anime.slug !==
                                                item.anime.slug &&
                                                'opacity-30 hover:opacity-60',
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-48 truncate">
                                    {item.anime.title}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </Stack>

                    {selectedWatch && (
                        <>
                            <Link
                                className="w-fit flex-1"
                                href={`/anime/${selectedWatch.anime.slug}`}
                            >
                                <H5>{selectedWatch.anime.title}</H5>
                                {renderAnimeDetails()}
                            </Link>

                            <div className="flex w-full flex-col gap-2">
                                <P className="text-sm text-muted-foreground">
                                    <span className="font-bold text-foreground">
                                        {updatedWatch?.episodes ??
                                            selectedWatch.episodes}
                                    </span>
                                    /{selectedWatch.anime.episodes_total ?? '?'}{' '}
                                    епізодів
                                </P>

                                <Progress
                                    className="h-2"
                                    value={
                                        updatedWatch?.episodes ??
                                        selectedWatch.episodes
                                    }
                                    max={
                                        selectedWatch.anime.episodes_total ??
                                        selectedWatch.episodes
                                    }
                                />
                            </div>

                            {renderActionButtons()}
                        </>
                    )}
                </Card>
            )}
        </>
    );
};

export default AnimeWatchlist;
