'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import MangaCard from '@/components/manga-card';
import NovelCard from '@/components/novel-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useMangaInfo from '@/services/hooks/manga/use-manga-info';
import useFranchise from '@/services/hooks/related/use-franchise';

interface Props {
    extended?: boolean;
}

const Franchise: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { data: manga } = useMangaInfo({ slug: String(params.slug) });

    const { data: franchise } = useFranchise({
        slug: String(params.slug),
        content_type: 'manga',
    });

    if (!manga || !manga.has_franchise) {
        return null;
    }

    if (!franchise) {
        return null;
    }

    const sortedList = franchise.list.sort((a, b) => {
        if (a.status === 'announced') return -1;
        if (b.status === 'announced') return 1;
        return b.year - a.year;
    });
    const filteredData = extended
        ? sortedList
        : sortedList.filter((v) => v.slug !== params.slug).slice(0, 4);

    const title = (
        <span>
            Пов’язане{' '}
            {sortedList && (
                <span className="text-muted-foreground">
                    ({sortedList.length})
                </span>
            )}
        </span>
    );

    return (
        <Block>
            <Header
                title={title}
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
