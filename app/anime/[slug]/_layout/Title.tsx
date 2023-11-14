'use client'

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';

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
        <div className="flex justify-between">
            <div>
                <h2>
                    {data.title_ua || data.title_en || data.title_ja}{' '}
                    <span className="font-normal">
                        ({new Date(data.start_date * 1000).getFullYear()})
                    </span>
                </h2>
                <p className="mt-2">{data.title_ja}</p>
            </div>
            <p className="text-4xl font-bold">{data.score}</p>
        </div>
    );
};

export default Component;
