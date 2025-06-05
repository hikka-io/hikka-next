'use client';

import { ReadResponse } from '@hikka/client';
import { FC } from 'react';

import MangaCard from '@/components/manga-card';
import NovelCard from '@/components/novel-card';

interface Props {
    data: ReadResponse[];
}

const GridView: FC<Props> = ({ data }) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
            {data.map((res) =>
                res.content.data_type === 'manga' ? (
                    <MangaCard
                        read={res}
                        manga={res.content}
                        key={res.reference}
                    />
                ) : (
                    <NovelCard
                        read={res}
                        novel={res.content}
                        key={res.reference}
                    />
                ),
            )}
        </div>
    );
};

export default GridView;
