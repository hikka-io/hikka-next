'use client';

import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import { useSettingsContext } from '@/services/providers/settings-provider';

interface Props {
    data: API.Watch[];
}

const GridView: FC<Props> = ({ data }) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
            {data.map((res) => (
                <ContentCard
                    slug={res.anime.slug}
                    content_type="anime"
                    key={res.reference}
                    title={res.anime.title}
                    poster={res.anime.poster}
                    href={`/anime/${res.anime.slug}`}
                />
            ))}
        </div>
    );
};

export default GridView;
