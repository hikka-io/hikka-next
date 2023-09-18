'use client';

import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AGE_RATING, MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';

const Component = () => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <div className="flex">
                    <div className="w-1/4">
                        <p>Тип:</p>
                    </div>
                    <div className="flex-1">
                        <p>{MEDIA_TYPE[data.media_type].title_ua}</p>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-1/4">
                        <p>Статус:</p>
                    </div>
                    <div className="flex-1">
                        <p>{RELEASE_STATUS[data.status].title_ua}</p>
                    </div>
                </div>
                {data.media_type !== 'movie' && (
                    <div className="flex">
                        <div className="w-1/4">
                            <p>Епізоди:</p>
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
                <div className="flex">
                    <div className="w-1/4">
                        <p>Тривалість епізоду:</p>
                    </div>
                    <div className="flex-1">
                        <p>{data.duration} хвилини</p>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-1/4">
                        <p>Жанри:</p>
                    </div>
                    <div className="flex-1">
                        {data.genres.map((genre, i) => (
                            <span key={genre.slug}>
                                <Link href={`/anime?genres=${genre.slug}`}>
                                    {genre.name_ua}
                                </Link>
                                {i + 1 !== data.genres.length && (
                                    <span>, </span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex">
                    <div className="w-1/4">
                        <p>Рейтинг:</p>
                    </div>
                    <div className="flex-1">
                        <p>{AGE_RATING[data.rating].title_ua}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
