'use client';

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

    const { mutate: addToList, isPending: addToListLoading } = useAddWatch({
        slug: String(params.slug),
    });

    const changeEpisodes = (action: 'increase' | 'decrease') => {
        let status = watch!.status;

        if (action === 'increase') {
            if (
                watch?.episodes &&
                watch.episodes + 1 === data?.episodes_total
            ) {
                status = 'completed';
            }

            if (!watch?.episodes && watch!.status === 'planned') {
                status = 'watching';
            }
        }

        switch (action) {
            case 'decrease':
                addToList({
                    status,
                    score: watch!.score,
                    episodes: watch?.episodes ? watch.episodes - 1 : 0,
                });
                break;
            case 'increase':
                addToList({
                    status,
                    score: watch!.score,
                    episodes: watch?.episodes ? watch.episodes + 1 : 1,
                });
                break;
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
                    onChange={(value) => {
                        addToList({
                            status: watch?.status,
                            score: value * 2,
                            episodes: watch?.episodes,
                        });
                    }}
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
                    <Label className="min-h-[24px] overflow-hidden text-ellipsis">
                        Епізоди
                    </Label>
                    <div className="inline-flex">
                        <Button
                            variant="secondary"
                            size="icon-xs"
                            className="rounded-r-none"
                            onClick={() => changeEpisodes('decrease')}
                        >
                            -
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon-xs"
                            className="rounded-l-none"
                            onClick={() => changeEpisodes('increase')}
                        >
                            +
                        </Button>
                    </div>
                </div>
                <H3>
                    {watch.episodes}
                    <Label className="text-sm font-normal text-muted-foreground">
                        /{watch.anime.episodes_total || '?'}
                    </Label>
                </H3>
                <Progress
                    className="mt-2 h-2"
                    max={watch.anime.episodes_total || watch.episodes}
                    value={watch.episodes}
                />
            </div>
        </div>
    );
};

export default WatchStats;
