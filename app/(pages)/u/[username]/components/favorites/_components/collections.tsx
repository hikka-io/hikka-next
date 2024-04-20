'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import EntryCard from '@/components/entry-card/entry-card';
import LoadMoreButton from '@/components/load-more-button';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import useFavorites from '@/services/hooks/favorite/useFavorites';
import { cn } from '@/utils/utils';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const {
        list,
        isPending,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ref,
    } = useFavorites<API.Content<'collection'>>({
        username: String(params.username),
        content_type: 'collection',
    });

    if (isPending) {
        return null;
    }

    if (!list && !extended) {
        return null;
    }

    const filteredData = (extended ? list : list?.slice(0, 6)) || [];
    const poster = (content: API.Anime | API.Character | API.Person) =>
        'poster' in content ? content.poster : content.image;

    return (
        <>
            {filteredData.length > 0 && (
                <div
                    className={cn(
                        'grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8',
                        !extended &&
                            'grid-min-10 no-scrollbar -mx-4 auto-cols-scroll grid-flow-col grid-cols-scroll overflow-x-auto px-4',
                    )}
                >
                    {filteredData.map((res) => (
                        <EntryCard
                            key={res.reference}
                            title={res.title}
                            poster={poster(res.collection[0].content)}
                            href={`/collections/${res.reference}`}
                            titleClassName={cn(
                                res.spoiler && 'blur hover:blur-none',
                            )}
                            containerClassName={cn(
                                res.nsfw && 'blur hover:blur-none',
                            )}
                            leftSubtitle={(res.nsfw && '+18') || undefined}
                            rightSubtitle={
                                (res.spoiler && 'Спойлери') || undefined
                            }
                        />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">Колекції</span> пусто
                        </span>
                    }
                    description="Цей список оновиться після того як сюди буде додано колекції"
                />
            )}
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </>
    );
};

export default Component;
