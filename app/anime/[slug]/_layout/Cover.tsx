'use client';

import Image from '@/app/_components/Image';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

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
        <div className="flex items-center md:px-0 px-16">
            <div className="w-full bg-inherit pt-[140%] relative overflow-hidden rounded-lg">
                <div className="absolute w-full h-full bg-gray-400 top-0 left-0">
                    <figure className="w-full h-full">
                        <Image
                            src={data.poster}
                            width={184}
                            height={259}
                            className="w-full h-full object-cover"
                            alt="Poster"
                        />
                    </figure>
                </div>
            </div>
        </div>
    );
};

export default Component;
