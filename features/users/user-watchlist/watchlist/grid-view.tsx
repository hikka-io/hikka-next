'use client';

import { FC } from 'react';

import AnimeCard from '@/components/anime-card';

interface Props {
    data: API.Watch[];
}

const GridView: FC<Props> = ({ data }) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
            {data.map((res) => (
                <AnimeCard anime={res.anime} key={res.reference} />
            ))}
        </div>
    );
};

export default GridView;
