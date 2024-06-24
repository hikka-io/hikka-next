'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import MangaCard from '@/components/manga-card';
import NovelCard from '@/components/novel-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';
import useFranchise from '@/services/hooks/related/use-franchise';

interface Props {
    extended?: boolean;
}

const Franchise: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    const { data: franchise } = useFranchise({
        slug: String(params.slug),
        content_type: 'anime',
    });

    if (!anime || !anime.has_franchise) {
        return null;
    }

    if (!franchise) {
        return null;
    }

    const filteredData = extended ? franchise.list : franchise.list.slice(0, 4);

    return (
        <Block>
            <Header
                title={`Пов’язане`}
                href={!extended ? params.slug + '/franchise' : undefined}
            />
            <Stack extended={extended} size={4} className="grid-min-10">
                {filteredData.map((content) => {
                    if (content.data_type === 'anime') {
                        return <AnimeCard key={content.slug} anime={content} />;
                    }

                    if (content.data_type === 'manga') {
                        return <MangaCard key={content.slug} manga={content} />;
                    }

                    if (content.data_type === 'novel') {
                        return <NovelCard key={content.slug} novel={content} />;
                    }
                })}
            </Stack>
        </Block>
    );
};

export default Franchise;
