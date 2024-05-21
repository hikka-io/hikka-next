'use client';

import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import SearchPlaceholders from '@/features/modals/search-modal/search-placeholders';

import AnimeCard from './anime-card';
import useAnimeSearchList from './useAnimeSearchList';

interface Props {
    onDismiss: (anime: API.Anime) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const AnimeSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = useAnimeSearchList({ value });

    return (
        <CommandList className="max-h-none">
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.list.length > 0 && (
                <CommandGroup>
                    {data.list.map((anime) => (
                        <CommandItem key={anime.slug} value={anime.slug}>
                            <AnimeCard
                                onClick={() => onDismiss(anime)}
                                anime={anime}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                </CommandGroup>
            )}
        </CommandList>
    );
};

export default AnimeSearchList;
