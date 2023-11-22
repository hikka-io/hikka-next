'use client';

import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import clsx from 'clsx';
import Rating from '@/app/_components/Rating';
import getWatch from '@/utils/api/watch/getWatch';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import addWatch from '@/utils/api/watch/addWatch';

const Component = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const { secret } = useAuthContext();
    const { data: watch, isError: watchError } = useQuery({
        queryKey: ['watch', secret, params.slug],
        queryFn: () =>
            getWatch({ slug: String(params.slug), secret: String(secret) }),
    });
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    const { mutate: addToList, isLoading: addToListLoading } = useMutation({
        mutationKey: ['addToList', secret, params.slug],
        mutationFn: (mutationParams: {
            status: Hikka.WatchStatus;
            score: number;
            episodes: number;
        }) =>
            addWatch({
                secret: String(secret),
                slug: String(params.slug),
                ...mutationParams,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['watch']);
        },
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
        <div className="stats grid grid-cols-2 bg-secondary/60 border border-secondary rounded-lg p-0">
            <div
                className={clsx(
                    'stat p-4',
                )}
            >
                <div className="stat-title text-inherit">Оцінка</div>
                <h3 className="mb-2">
                    {watch.score}
                    <span className="text-sm font-normal label-text opacity-60">
                        /10
                    </span>
                </h3>
                <Rating
                    className="rating-md"
                    onChange={(value) =>
                        addToList({
                            status: watch?.status,
                            score: value,
                            episodes: watch?.episodes,
                        })
                    }
                    value={watch.score}
                />
            </div>
            <div
                className={clsx(
                    'stat p-4',
                )}
            >
                <div className="flex gap-2 justify-between">
                    <div className="stat-title text-inherit">Епізоди</div>
                    <div className="join">
                        <button
                            className="btn join-item btn-xs btn-secondary"
                            onClick={() => changeEpisodes('decrease')}
                        >
                            -
                        </button>
                        <button
                            className="btn join-item btn-xs btn-secondary"
                            onClick={() => changeEpisodes('increase')}
                        >
                            +
                        </button>
                    </div>
                </div>
                <h3 className="mb-2">
                    {watch.episodes}
                    <span className="text-sm font-normal label-text opacity-60">
                        /{watch.anime.episodes_total || '?'}
                    </span>
                </h3>
                <progress
                    className="progress progress-accent"
                    value={watch.episodes}
                    max={watch.anime.episodes_total || watch.episodes}
                ></progress>
            </div>
        </div>
    );
};

export default Component;
