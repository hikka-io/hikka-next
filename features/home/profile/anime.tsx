'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import MaterialSymbolsRemoveRounded from '~icons/material-symbols/remove-rounded';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

import ContentCard from '@/components/content-card/content-card';
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

import WatchEditModal from '@/features/modals/watch-edit-modal';

import useSession from '@/services/hooks/auth/use-session';
import useAddWatch from '@/services/hooks/watch/use-add-watch';
import useWatchList from '@/services/hooks/watch/use-watch-list';
import { useModalContext } from '@/services/providers/modal-provider';
import { ANIME_MEDIA_TYPE } from '@/utils/constants';
import getDeclensionWord from '@/utils/get-declension-word';
import { cn } from '@/utils/utils';

const EPISODES_DECLENSION: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];

const Anime = () => {
    const router = useRouter();
    const { openModal } = useModalContext();
    const [selectedSlug, setSelectedSlug] = useState<string>();
    const { user: loggedUser } = useSession();

    const { list } = useWatchList({
        username: String(loggedUser?.username),
        watch_status: 'watching',
        sort: ['watch_created:desc'],
    });

    const selectedWatch =
        list?.find((item) => item.anime.slug === selectedSlug) || list?.[0];

    const {
        mutate: mutateAddWatch,
        variables,
        isPending,
        reset,
    } = useAddWatch();

    const handleSelect = (slug: string) => {
        if (slug === selectedSlug) {
            router.push(`/anime/${slug}`);
        }

        setSelectedSlug(slug);
    };

    const openWatchEditModal = () => {
        if (selectedWatch) {
            openModal({
                content: <WatchEditModal slug={selectedWatch.anime.slug} />,
                className: '!max-w-xl',
                title: selectedWatch.anime.title,
                forceModal: true,
            });
        }
    };

    const handleAddEpisode = () => {
        if (selectedWatch) {
            const episodes =
                (variables?.params?.episodes || selectedWatch.episodes) + 1;

            if (
                selectedWatch.anime.episodes_total &&
                episodes > selectedWatch.anime.episodes_total
            )
                return;

            mutateAddWatch({
                params: {
                    ...selectedWatch,
                    status:
                        episodes === selectedWatch.anime.episodes_total
                            ? 'completed'
                            : 'watching',
                    slug: selectedWatch.anime.slug,
                    episodes,
                },
            });
        }
    };

    const handleRemoveEpisode = () => {
        if (selectedWatch) {
            const episodes =
                (variables?.params?.episodes || selectedWatch.episodes) - 1;

            if (episodes < 0) return;

            mutateAddWatch({
                params: {
                    ...selectedWatch,
                    slug: selectedWatch.anime.slug,
                    episodes,
                },
            });
        }
    };

    useEffect(() => {
        reset();
    }, [selectedSlug]);

    return (
        <Fragment>
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
            )}{' '}
            {list && list?.length > 0 && (
                <Card className="h-full">
                    <Stack className="grid-min-3 grid-max-3 gap-4 lg:gap-4">
                        {list?.map((item) => (
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
                    <Link
                        className="w-fit flex-1"
                        href={`/anime/${selectedWatch?.anime.slug}`}
                    >
                        <H5>{selectedWatch?.anime.title}</H5>

                        <div className="mt-1 flex cursor-pointer items-center gap-2">
                            {selectedWatch?.anime.year && (
                                <Fragment>
                                    <Label className="cursor-pointer text-xs text-muted-foreground">
                                        {selectedWatch?.anime.year}
                                    </Label>
                                </Fragment>
                            )}
                            {selectedWatch?.anime.media_type && (
                                <Fragment>
                                    <div className="size-1 rounded-full bg-muted-foreground" />
                                    <Label className="cursor-pointer text-xs text-muted-foreground">
                                        {
                                            ANIME_MEDIA_TYPE[
                                                selectedWatch?.anime.media_type
                                            ].title_ua
                                        }
                                    </Label>
                                </Fragment>
                            )}
                            {selectedWatch?.anime.episodes_total && (
                                <Fragment>
                                    <div className="size-1 rounded-full bg-muted-foreground" />
                                    <Label className="cursor-pointer text-xs text-muted-foreground">
                                        {selectedWatch?.anime.episodes_total}{' '}
                                        {getDeclensionWord(
                                            selectedWatch?.anime.episodes_total,
                                            EPISODES_DECLENSION,
                                        )}
                                    </Label>
                                </Fragment>
                            )}
                        </div>
                    </Link>
                    <div className="flex w-full flex-col gap-2">
                        <P className="text-sm text-muted-foreground">
                            <span className="font-bold text-foreground">
                                {isPending
                                    ? variables?.params?.episodes
                                    : selectedWatch?.episodes || 0}
                            </span>
                            /{selectedWatch?.anime.episodes_total || '?'}{' '}
                            епізодів
                        </P>

                        <Progress
                            className="h-2"
                            value={
                                isPending
                                    ? variables?.params?.episodes
                                    : selectedWatch?.episodes
                            }
                            max={
                                selectedWatch?.anime.episodes_total ||
                                selectedWatch?.episodes
                            }
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openWatchEditModal}
                        >
                            <MaterialSymbolsSettingsOutline />
                            Налаштування
                        </Button>
                        <div className="flex">
                            <Button
                                className="flex-1 rounded-r-none"
                                onClick={handleAddEpisode}
                                variant="secondary"
                                size="sm"
                                // disabled={isPending}
                            >
                                <MaterialSymbolsAddRounded />
                                <div className="flex gap-1">
                                    <span className="hidden sm:block">
                                        Додати
                                    </span>
                                    <span className="capitalize	sm:normal-case">
                                        епізод
                                    </span>
                                </div>
                            </Button>
                            <Button
                                className="rounded-l-none"
                                onClick={handleRemoveEpisode}
                                variant="secondary"
                                size="icon-md"
                                // disabled={isPending}
                            >
                                <MaterialSymbolsRemoveRounded />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </Fragment>
    );
};

export default Anime;
