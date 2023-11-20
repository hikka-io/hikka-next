'use client';

import { useParams } from 'next/navigation';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import getAnimeCharacters, { Response } from '@/utils/api/anime/getAnimeCharacters';
import BaseCard from '@/app/_components/BaseCard';
import SubHeader from '@/app/_components/SubHeader';
import {useInView} from "react-intersection-observer";
import {useEffect} from "react";

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['characters', params.slug],
        getNextPageParam: (lastPage: Response, allPages) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages
                ? undefined
                : nextPage;
        },
        queryFn: ({ pageParam = 1 }) => getAnimeCharacters({ slug: String(params.slug), page: pageParam }),
    });

    useEffect(() => {
        if (inView && data) {
            fetchNextPage();
        }
    }, [inView])

    if (!data || !data.pages) {
        return null;
    }

    const list = data.pages.map((data) => data.list).flat(1);

    const filteredData = extended
        ? list
        : list.filter((ch) => ch.main).slice(0, 6);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title={extended ? 'Персонажі' : 'Головні Персонажі'}
                href={!extended ? params.slug + '/characters' : undefined}
            />
            <div className="grid md:grid-cols-6 grid-cols-3 gap-4 lg:gap-8">
                {filteredData.map((ch) => (
                    <BaseCard
                        key={ch.character.slug}
                        // href={`/characters/${ch.character.slug}`}
                        poster={ch.character.image}
                        title={
                            ch.character.name_ua ||
                            ch.character.name_en ||
                            ch.character.name_ja
                        }
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
            {extended && hasNextPage && (
                <button
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="btn btn-secondary"
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </button>
            )}
        </div>
    );
};

export default Component;
