'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import MangaCard from '@/components/manga-card';
import NovelCard from '@/components/novel-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useFranchise from '@/services/hooks/related/use-franchise';

import FranchiseFilters from './franchise-filters';
import FranchiseItem from './franchise-item';

interface Props {
    extended?: boolean;
    content_type: API.ContentType;
}

const Franchise: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const searchParams = useSearchParams();

    const view = (searchParams.get('view') || 'list') as Hikka.View;
    const content_types = searchParams.getAll('content_types');

    const { data: franchise } = useFranchise({
        slug: String(params.slug),
        content_type,
    });

    if (!franchise) {
        return null;
    }

    const sortedList = franchise.list.sort((a, b) => {
        if (a.status === 'announced') return -1;
        if (b.status === 'announced') return 1;
        return b.year - a.year;
    });
    const filteredData = extended
        ? sortedList.filter((v) => content_types.includes(v.data_type))
        : sortedList.filter((v) => v.slug !== params.slug).slice(0, 2);

    const title = (
        <span>
            <span className="truncate">Пов’язане</span>{' '}
            {sortedList && (
                <span className="text-muted-foreground">
                    ({sortedList.length})
                </span>
            )}
        </span>
    );

    return (
        <Block>
            <div className="flex items-center justify-between">
                <Header
                    className="flex-1"
                    title={title}
                    href={
                        !extended
                            ? params.slug +
                              '/franchise?content_types=anime&content_types=manga&content_types=novel'
                            : undefined
                    }
                />
                {extended && <FranchiseFilters />}
            </div>
            <Stack
                extended={extended}
                size={2}
                extendedSize={view === 'list' ? 2 : 6}
                className="grid-min-20"
            >
                {view === 'list' &&
                    filteredData.map((content) => (
                        <FranchiseItem key={content.slug} content={content} />
                    ))}

                {view === 'grid' &&
                    filteredData.map((content) => {
                        if (content.data_type === 'anime') {
                            return (
                                <AnimeCard key={content.slug} anime={content} />
                            );
                        }

                        if (content.data_type === 'manga') {
                            return (
                                <MangaCard key={content.slug} manga={content} />
                            );
                        }

                        if (content.data_type === 'novel') {
                            return (
                                <NovelCard key={content.slug} novel={content} />
                            );
                        }
                    })}
            </Stack>
        </Block>
    );
};

export default Franchise;
