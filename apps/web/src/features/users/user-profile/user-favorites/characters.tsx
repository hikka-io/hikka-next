'use client';

import { ContentTypeEnum, FavouriteCharacterResponse } from '@hikka/client';
import { useFavouriteList } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import LoadMoreButton from '@/components/load-more-button';
import NotFound from '@/components/ui/not-found';
import Stack from '@/components/ui/stack';

interface Props {
    extended?: boolean;
}

const Characters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list,
        isPending,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ref,
    } = useFavouriteList<FavouriteCharacterResponse>({
        username: String(params.username),
        contentType: ContentTypeEnum.CHARACTER,
    });

    if (isPending) {
        return null;
    }

    if (!list && !extended) {
        return null;
    }

    const filteredData = (extended ? list : list?.slice(0, 6)) || [];

    return (
        <>
            {filteredData.length > 0 && (
                <Stack
                    extended={extended}
                    size={6}
                    extendedSize={6}
                    className="grid-min-10"
                >
                    {filteredData.map((res) => (
                        <ContentCard
                            key={res.slug}
                            title={res.name_ua || res.name_en || res.name_ja}
                            image={res.image}
                            href={`/characters/${res.slug}`}
                            content_type={ContentTypeEnum.CHARACTER}
                            slug={res.slug}
                        />
                    ))}
                </Stack>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">Персонажі</span> пусто
                        </span>
                    }
                    description="Цей список оновиться після того як сюди буде додано персонажів"
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

export default Characters;
