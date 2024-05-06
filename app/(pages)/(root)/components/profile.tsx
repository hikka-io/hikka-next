'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import MaterialSymbolsRemoveRounded from '~icons/material-symbols/remove-rounded';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

import Link from 'next/link';

import ContentCard from '@/components/content-card/content-card';
import WatchEditModal from '@/components/modals/watch-edit-modal';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import useSession from '@/services/hooks/auth/useSession';
import useAddWatch from '@/services/hooks/watch/useAddWatch';
import useWatchList from '@/services/hooks/watch/useWatchList';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';


const Profile = () => {
    const { openModal } = useModalContext();
    const [selectedSlug, setSelectedSlug] = useState<string>();
    const { user: loggedUser } = useSession();

    const { list, queryKey } = useWatchList({
        username: String(loggedUser?.username),
        watch_status: 'watching',
    });

    const selectedWatch =
        list?.find((item) => item.anime.slug === selectedSlug) || list?.[0];

    const { mutate: mutateAddWatch, variables, isPending, reset } = useAddWatch();

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
        <Block>
            <Header title="Профіль" href={`/u/${loggedUser?.username}`} />
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
            {list && list?.length > 0 && (
                <Card>
                    <Stack className="grid-min-3 gap-4 lg:gap-4">
                        {list?.map((item) => (
                            <Tooltip key={item.anime.slug}>
                                <TooltipTrigger asChild>
                                    <ContentCard
                                        onClick={() =>
                                            setSelectedSlug(item.anime.slug)
                                        }
                                        poster={item.anime.poster}
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
                        className="w-fit"
                        href={`/anime/${selectedWatch?.anime.slug}`}
                    >
                        <H5>{selectedWatch?.anime.title}</H5>
                    </Link>
                    <div className="flex w-full flex-col gap-2">
                        <P className="text-sm text-muted-foreground">
                            <span className="font-bold text-foreground">
                                {isPending
                                    ? variables?.params?.episodes
                                    : selectedWatch?.episodes || 0}
                            </span>
                            /{selectedWatch?.anime.episodes_total || '?'}
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
        </Block>
    );
};

export default Profile;
