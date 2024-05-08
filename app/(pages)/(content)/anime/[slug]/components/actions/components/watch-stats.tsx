'use client';

import React from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import MaterialSymbolsRemoveRounded from '~icons/material-symbols/remove-rounded';

import { useParams } from 'next/navigation';

import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import useAddWatch from '@/services/hooks/watch/useAddWatch';
import useWatch from '@/services/hooks/watch/useWatch';


const WatchStats = () => {
    const params = useParams();

    const { data: watch, isError: watchError } = useWatch({
        slug: String(params.slug),
    });
    const { data } = useAnimeInfo({ slug: String(params.slug) });

    const { mutate: mutateAddWatch, variables, isPending } = useAddWatch();

    const handleAddEpisode = () => {
        if (watch) {
            const episodes =
                (variables?.params?.episodes || watch.episodes) + 1;

            if (episodes <= watch.anime.episodes_total || !watch.anime.episodes_total) {
                let status = watch.status;

                if (episodes === watch.anime.episodes_total) {
                    status = 'completed';
                }

                if (!watch.episodes && watch.status === 'planned') {
                    status = 'watching';
                }

                mutateAddWatch({
                    params: {
                        ...watch,
                        status,
                        slug: watch.anime.slug,
                        episodes,
                    },
                });
            }
        }
    };

    const handleRemoveEpisode = () => {
        if (watch) {
            const episodes =
                (variables?.params?.episodes || watch.episodes) - 1;
            
            if (episodes >= 0) {
                mutateAddWatch({
                    params: {
                        ...watch,
                        slug: watch.anime.slug,
                        episodes,
                    },
                });
            }
        }
    };

    const handleRating = (value: number) => {
        if (watch) {
            mutateAddWatch({
                params: {
                    ...watch,
                    slug: watch.anime.slug,
                    score: value * 2,
                },
            });
        }
    };

    if (!watch || watchError || !data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4 rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                <Rating
                    // className="rating-md lg:flex"
                    onChange={handleRating}
                    totalStars={5}
                    precision={0.5}
                    value={watch.score ? watch.score / 2 : 0}
                />
                <H3>
                    {watch.score}
                    <Label className="text-sm font-normal text-muted-foreground">
                        /10
                    </Label>
                </H3>
            </div>
            <div className="rounded-lg border border-secondary/60 bg-secondary/30 p-4">
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
                    {isPending ? variables?.params?.episodes : watch.episodes}
                    <Label className="text-sm font-normal text-muted-foreground">
                        /{watch.anime.episodes_total || '?'}
                    </Label>
                </H3>
                <Progress
                    className="mt-2 h-2"
                    max={watch.anime.episodes_total || watch.episodes}
                    value={
                        isPending ? variables?.params?.episodes : watch.episodes
                    }
                />
            </div>
        </div>
    );
};

export default WatchStats;
