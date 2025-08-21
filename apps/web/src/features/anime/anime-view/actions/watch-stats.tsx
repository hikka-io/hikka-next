'use client';

import { WatchArgs, WatchStatusEnum } from '@hikka/client';
import { useAnimeBySlug, useCreateWatch, useWatchBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';

import CollapsibleFilter from '@/features/filters/collapsible-filter';

import useDebounce from '@/services/hooks/use-debounce';

const WatchStats = () => {
    const params = useParams();

    const [updatedWatch, setUpdatedWatch] = useState<WatchArgs | null>(null);

    const deboucedUpdatedWatch = useDebounce({
        value: updatedWatch,
        delay: 500,
    });

    const { data: watch, isError: watchError } = useWatchBySlug({
        slug: String(params.slug),
    });
    const { data } = useAnimeBySlug({
        slug: String(params.slug),
    });

    const { mutate: mutateCreateWatch } = useCreateWatch();

    const handleAddEpisode = () => {
        if (watch) {
            const episodes = (updatedWatch?.episodes ?? watch.episodes) + 1;

            if (
                watch.anime.episodes_total &&
                episodes > watch.anime.episodes_total
            )
                return;

            let status = updatedWatch?.status ?? watch.status;

            if (episodes === watch.anime.episodes_total) {
                status = WatchStatusEnum.COMPLETED;
            }

            if (!watch.episodes && watch.status === WatchStatusEnum.PLANNED) {
                status = WatchStatusEnum.WATCHING;
            }

            setUpdatedWatch({
                rewatches: watch.rewatches,
                note: watch.note,
                score: watch.score,
                status,
                episodes,
            });
        }
    };

    const handleRemoveEpisode = () => {
        if (watch) {
            const episodes = (updatedWatch?.episodes ?? watch.episodes) - 1;

            if (episodes < 0) return;

            setUpdatedWatch({
                rewatches: watch.rewatches,
                note: watch.note,
                score: watch.score,
                status: watch.status,
                episodes,
            });
        }
    };

    const handleRating = (value: number) => {
        if (watch) {
            mutateCreateWatch({
                slug: watch.anime.slug,
                args: {
                    score: value * 2,
                    status: watch.status,
                    episodes: watch.episodes,
                    rewatches: watch.rewatches,
                    note: watch.note,
                },
            });
        }
    };

    useEffect(() => {
        if (deboucedUpdatedWatch) {
            mutateCreateWatch({
                slug: watch!.anime.slug,
                args: deboucedUpdatedWatch,
            });
        }
    }, [mutateCreateWatch, deboucedUpdatedWatch]);

    if (!watch || watchError || !data) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <CollapsibleFilter title="Оцінка" defaultOpen>
                <div className="flex items-center justify-between gap-4">
                    <Rating
                        onChange={handleRating}
                        totalStars={5}
                        precision={0.5}
                        value={watch.score ? watch.score / 2 : 0}
                    />
                    <P className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">
                            {watch.score}
                        </span>
                        /10
                    </P>
                </div>
            </CollapsibleFilter>

            <CollapsibleFilter title="Епізоди" defaultOpen>
                <div className="flex w-full flex-col gap-2">
                    <P className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">
                            {updatedWatch?.episodes ?? watch.episodes}
                        </span>
                        /{watch.anime.episodes_total ?? '?'} епізодів
                    </P>
                    <Progress
                        className="h-2"
                        max={watch.anime.episodes_total ?? watch.episodes}
                        value={updatedWatch?.episodes ?? watch.episodes}
                    />
                </div>
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
            </CollapsibleFilter>
        </div>
    );
};

export default WatchStats;
