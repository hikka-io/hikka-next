'use client';

import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { AGE_RATING, MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import Image from 'next/image';
import SubHeader from '@/app/_components/SubHeader';

const Component = () => {
    const params = useParams();

    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data) {
        return null;
    }

    const studio = data.companies.find((c) => c.type === 'studio');

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Деталі" />
            <div className="flex flex-col gap-4 p-4 border border-secondary/60 rounded-lg bg-secondary/30">
                <div className="flex flex-wrap">
                    <div className="w-24">
                        <p className="label-text">Тип:</p>
                    </div>
                    <div className="flex-1">
                        <p className="label-text text-white">
                            {MEDIA_TYPE[data.media_type].title_ua}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-24">
                        <p className="label-text">Статус:</p>
                    </div>
                    <div className="flex-1">
                        <div
                            className="rounded-md px-2 w-fit"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[data.status].color,
                            }}
                        >
                            <p className="label-text text-white">
                                {RELEASE_STATUS[data.status].title_ua}
                            </p>
                        </div>
                    </div>
                </div>
                {data.media_type !== 'movie' &&
                data.episodes_total &&
                data.episodes_released !== null ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <p className="label-text">Епізоди:</p>
                        </div>
                        <div className="flex-1">
                            <p className="label-text text-white">
                                {data.status === 'finished'
                                    ? data.episodes_total
                                    : `${data.episodes_released} / ${data.episodes_total}`}
                            </p>
                        </div>
                    </div>
                ) : null}
                {data.duration ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <p className="label-text">Тривалість епізоду:</p>
                        </div>
                        <div className="flex-1">
                            <p className="label-text text-white">
                                {formatDuration(
                                    intervalToDuration({
                                        start: 0,
                                        end: data.duration * 60 * 1000,
                                    }),
                                )}
                            </p>
                        </div>
                    </div>
                ) : null}

                {data.rating ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <p className="label-text">Рейтинг:</p>
                        </div>
                        <div className="flex-1">
                            <p className="label-text text-white">
                                {AGE_RATING[data.rating].title_ua}
                            </p>
                        </div>
                    </div>
                ) : null}
                {studio ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <p className="label-text">Студія:</p>
                        </div>
                        <div className="flex-1">
                            {studio.company.image ? (
                                <div
                                    className="tooltip"
                                    data-tip={studio.company.name}
                                >
                                    <Image
                                        src={studio.company.image}
                                        alt="studio"
                                        width={100}
                                        height={50}
                                        className="object-cover w-16 rounded-md"
                                    />
                                </div>
                            ) : (
                                <p className="label-text text-white">
                                    {studio.company.name}
                                </p>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Component;
