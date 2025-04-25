'use client';

import { WatchArgs, WatchStatusEnum } from '@hikka/client';
import {
    useAddOrUpdateWatch,
    useAnimeBySlug,
    useWatchEntry,
} from '@hikka/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';

import useDebounce from '@/services/hooks/use-debounce';

const WatchStats = () => {
    const params = useParams();

    const [updatedWatch, setUpdatedWatch] = useState<WatchArgs | null>(null);

    const deboucedUpdatedWatch = useDebounce({
        value: updatedWatch,
        delay: 500,
    });

    const { data: watch, isError: watchError } = useWatchEntry({
        slug: String(params.slug),
    });
    const { data } = useAnimeBySlug({
        slug: String(params.slug),
    });

    const { mutate: mutateAddOrUpdateWatch } = useAddOrUpdateWatch();

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
            mutateAddOrUpdateWatch({
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
            mutateAddOrUpdateWatch({
                slug: watch!.anime.slug,
                args: deboucedUpdatedWatch,
            });
        }
    }, [mutateAddOrUpdateWatch, deboucedUpdatedWatch]);

    if (!watch || watchError || !data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="border-border bg-secondary/20 flex justify-between gap-4 rounded-lg border p-4">
                <Rating
                    // className="rating-md lg:flex"
                    onChange={handleRating}
                    totalStars={5}
                    precision={0.5}
                    value={watch.score ? watch.score / 2 : 0}
                />
                <H3>
                    {watch.score}
                    <Label className="text-muted-foreground text-sm font-normal">
                        /10
                    </Label>
                </H3>
            </div>
            <div className="border-border bg-secondary/20 rounded-lg border p-4">
                <div className="flex justify-between gap-2 overflow-hidden">
                    <Label className="min-h-[24px] self-center overflow-hidden text-ellipsis">
                        Епізоди
                    </Label>
                    <div className="inline-flex">
                        <Button
                            variant="secondary"
                            size="icon-sm"
                            className="rounded-r-none"
                            onClick={handleRemoveEpisode}
                        >
                            <MaterialSymbolsRemoveRounded />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon-sm"
                            className="rounded-l-none"
                            onClick={handleAddEpisode}
                        >
                            <MaterialSymbolsAddRounded />
                        </Button>
                    </div>
                </div>
                <H3>
                    {updatedWatch?.episodes ?? watch.episodes}
                    <Label className="text-muted-foreground text-sm font-normal">
                        /{watch.anime.episodes_total || '?'}
                    </Label>
                </H3>
                <Progress
                    className="mt-2 h-2"
                    max={watch.anime.episodes_total ?? watch.episodes}
                    value={updatedWatch?.episodes ?? watch.episodes}
                />
            </div>
        </div>
    );
};

export default WatchStats;
