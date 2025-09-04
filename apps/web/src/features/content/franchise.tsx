'use client';

import { RelatedContentType } from '@hikka/client';
import { useFranchise } from '@hikka/react';
import { useParams, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import MangaCard from '@/components/manga-card';
import NovelCard from '@/components/novel-card';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { useMediaQuery } from '@/services/hooks/use-media-query';

import FranchiseFilters from './components/franchise/franchise-filters';
import FranchiseItem from './components/franchise/franchise-item';

interface Props {
    extended?: boolean;
    content_type: RelatedContentType;
}

const Franchise: FC<Props> = ({ extended, content_type }) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const params = useParams();
    const searchParams = useSearchParams();

    const view = (searchParams.get('view') || 'list') as Hikka.View;
    const content_types = searchParams.getAll('content_types');

    const { data: franchise } = useFranchise({
        contentType: content_type,
        slug: String(params.slug),
        options: {
            select: (data) => {
                return {
                    list: [...data.anime, ...data.manga, ...data.novel],
                };
            },
        },
    });

    if (!franchise) {
        return null;
    }

    const sortedList = franchise.list.sort((a, b) => {
        if (a.status === 'announced') return -1;
        if (b.status === 'announced') return 1;
        return (b?.year ?? 0) - (a?.year ?? 0);
    });
    const filteredData = extended
        ? sortedList.filter((v) => content_types.includes(v.data_type))
        : sortedList.filter((v) => v.slug !== params.slug).slice(0, 2);

    const title = (
        <span>
            <span className="truncate">Пов’язане</span>{' '}
            {sortedList && (
                <span className="text-muted-foreground">
                    ({extended ? filteredData.length : sortedList.length})
                </span>
            )}
        </span>
    );

    return (
        <Block>
            <div className="flex items-center justify-between">
                <Header
                    className="flex-1"
                    href={
                        !extended
                            ? params.slug +
                              '/franchise?content_types=anime&content_types=manga&content_types=novel'
                            : undefined
                    }
                >
                    <HeaderContainer>
                        <HeaderTitle>{title}</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                    {extended && <FranchiseFilters />}
                </Header>
            </div>
            <Stack
                extended={extended}
                size={2}
                extendedSize={view === 'list' ? 2 : 5}
                className="grid-min-20"
            >
                {view === 'list' &&
                    filteredData.map((content) => (
                        <FranchiseItem
                            preview={!extended && !isDesktop}
                            key={content.slug}
                            content={content}
                        />
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
