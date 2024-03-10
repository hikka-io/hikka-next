'use client';

import { useParams } from 'next/navigation';

import BaseCard from '@/components/ui/base-card';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import useFavorites from '@/services/hooks/favorite/useFavorites';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { list, isPending, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useFavorites<API.Content<'character'>>({
            username: String(params.username),
            content_type: 'character',
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
                <div className="grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8">
                    {filteredData.map((res) => (
                        <BaseCard
                            key={res.slug}
                            title={res.name_ua || res.name_en || res.name_ja}
                            poster={res.image}
                            href={`/characters/${res.slug}`}
                        />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">Персонажі</span> пусто
                        </span>
                    }
                    description="Цей список оновиться після як сюди буде додано персонажей"
                />
            )}
            {extended && hasNextPage && (
                <Button
                    variant="outline"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Завантажити ще
                </Button>
            )}
        </>
    );
};

export default Component;
