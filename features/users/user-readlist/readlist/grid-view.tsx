'use client';

import { FC } from 'react';

import MangaCard from '@/components/manga-card';

interface Props {
    data: API.Read[];
}

const GridView: FC<Props> = ({ data }) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
            {data.map((res) => (
                <MangaCard manga={res.content} key={res.reference} />
            ))}
        </div>
    );
};

export default GridView;
