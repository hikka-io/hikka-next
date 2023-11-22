'use client';

import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AGE_RATING, MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import Image from 'next/image';

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
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <div className="flex">
                    <div className="w-1/4">
                        <p className="label-text">Тип:</p>
                    </div>
                    <div className="flex-1">
                        <p>{MEDIA_TYPE[data.media_type].title_ua}</p>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-1/4">
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
                            <p>{RELEASE_STATUS[data.status].title_ua}</p>
                        </div>
                    </div>
                </div>
                {data.media_type !== 'movie' &&
                    data.episodes_total &&
                    data.episodes_released !== null && (
                        <div className="flex">
                            <div className="w-1/4">
                                <p className="label-text">Епізоди:</p>
                            </div>
                            <div className="flex-1">
                                <p>
                                    {data.status === 'finished'
                                        ? data.episodes_total
                                        : `${data.episodes_released} / ${data.episodes_total}`}
                                </p>
                            </div>
                        </div>
                    )}
                {data.duration && (
                    <div className="flex">
                        <div className="w-1/4">
                            <p className="label-text">Тривалість епізоду:</p>
                        </div>
                        <div className="flex-1">
                            <p>
                                {formatDuration(
                                    intervalToDuration({
                                        start: 0,
                                        end: data.duration * 60 * 1000,
                                    }),
                                )}
                            </p>
                        </div>
                    </div>
                )}
                {data.genres.length > 0 && (
                    <div className="flex">
                        <div className="w-1/4">
                            <p className="label-text">Жанри:</p>
                        </div>
                        <div className="flex-1">
                            {data.genres.map((genre, i) => (
                                <span key={genre.slug}>
                                    <Link
                                        className="rounded-sm underline decoration-accent decoration-dashed hover:bg-accent hover:text-accent-content transition-colors duration-100"
                                        href={`/anime?genres=${genre.slug}`}
                                    >
                                        {genre.name_ua}
                                    </Link>
                                    {i + 1 !== data.genres.length && (
                                        <span>, </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {data.rating && (
                    <div className="flex">
                        <div className="w-1/4">
                            <p className="label-text">Рейтинг:</p>
                        </div>
                        <div className="flex-1">
                            <p>{AGE_RATING[data.rating].title_ua}</p>
                        </div>
                    </div>
                )}
                {studio && (
                    <div className="flex">
                        <div className="w-1/4">
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
                                <p>{studio.company.name}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Component;
