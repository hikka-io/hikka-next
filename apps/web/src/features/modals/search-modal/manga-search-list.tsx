'use client';

import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '../../../components/ui/command';
import MangaCard from './cards/manga-card';
import useMangaSearchList from './hooks/useMangaSearchList';
import SearchPlaceholders from './search-placeholders';

interface Props {
    onDismiss: (manga: API.Manga) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const MangaSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = useMangaSearchList({ value });

    return (
        <CommandList className="max-h-none">
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.list.length > 0 && (
                <CommandGroup>
                    {data.list.map((manga) => (
                        <CommandItem key={manga.slug} value={manga.slug}>
                            <MangaCard
                                onClick={() => onDismiss(manga)}
                                manga={manga}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                </CommandGroup>
            )}
        </CommandList>
    );
};

export default MangaSearchList;
