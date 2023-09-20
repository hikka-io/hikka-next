'use client';

import Image from '@/app/components/Image';
import ArrowDropdown from '@/app/components/icons/ArrowDropdown';
import Favorite from '@/app/components/icons/Favorite';
import Planned from '@/app/components/icons/watchStatus/Planned';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Component = () => {
    const params = useParams();
    const [paddingX, setPaddingX] = useState(0);
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    useEffect(() => {
        const handleScroll = (e: any) => {
            if (
                e.target &&
                e.target.scrollingElement!.scrollTop > 100 &&
                e.target.scrollingElement!.scrollTop < 200
            ) {
                setPaddingX(e.target.scrollingElement!.scrollTop - 100);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <div
                    className="flex items-center md:px-0 px-12"
                >
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
                <div className="flex gap-2 fixed bottom-0 left-0 right-0 z-10 p-4 bg-black/90 md:p-0 md:bg-transparent md:relative">
                    <div className="join w-full">
                        <button className="btn btn-outline bg-secondary/60 flex-1 join-item btn-md">
                            <Planned />
                            Додати в Список
                        </button>
                        <button className="btn btn-square bg-secondary/30 btn-outline text-xl join-item btn-md">
                            <ArrowDropdown />
                        </button>
                    </div>
                    <button className="btn btn-square btn-outline text-xl btn-md">
                        <Favorite />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Component;
