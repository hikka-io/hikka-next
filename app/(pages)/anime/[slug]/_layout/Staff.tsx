'use client';

import { useParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import getAnimeStaff, {
    Response as AnimeStuffResponse,
} from '@/utils/api/anime/getAnimeStaff';
import BaseCard from '@/app/_components/BaseCard';
import SubHeader from '@/app/_components/SubHeader';
import { useInView } from 'react-intersection-observer';
import {useEffect} from "react";
import clsx from "clsx";

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ['staff', params.slug],
            getNextPageParam: (lastPage: AnimeStuffResponse, allPages) => {
                const nextPage = lastPage.pagination.page + 1;
                return nextPage > lastPage.pagination.pages
                    ? undefined
                    : nextPage;
            },
            queryFn: ({ pageParam = 1 }) =>
                getAnimeStaff({ slug: String(params.slug), page: pageParam }),
        });

    useEffect(() => {
        if (inView && data) {
            fetchNextPage();
        }
    }, [inView])

    if (!data || !data.pages || data.pages[0].list.length === 0) {
        return null;
    }

    const list = data.pages.map((data) => data.list).flat(1);

    const filteredData = extended ? list : list.slice(0, 4);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Автори"
                href={!extended ? params.slug + '/staff' : undefined}
            />
            <div className={clsx("grid md:grid-cols-4 grid-cols-3 gap-4 lg:gap-8", extended && "md:grid-cols-6")}>
                {filteredData.map((staff) => (
                    <BaseCard
                        key={staff.person.slug}
                        // href={`/person/${staff.person.slug}`}
                        poster={staff.person.image}
                        title={
                            staff.person.name_ua ||
                            staff.person.name_en ||
                            staff.person.name_native
                        }
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
