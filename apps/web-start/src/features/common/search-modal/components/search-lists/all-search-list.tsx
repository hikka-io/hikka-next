'use client';

import { MainContent } from '@hikka/client';
import {
    useSearchAnimes,
    useSearchCharacters,
    useSearchMangas,
    useSearchNovels,
    useSearchPeople,
} from '@hikka/react';
import { Ellipsis } from 'lucide-react';
import { useCallback } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import AnimeCard from '../cards/anime-card';
import CharacterCard from '../cards/character-card';
import MangaCard from '../cards/manga-card';
import NovelCard from '../cards/novel-card';
import PersonCard from '../cards/person-card';
import SearchPlaceholders from '../search-placeholders';

const ALL_SEARCH_SIZE = 3;

interface Props {
    onDismiss: (content: MainContent) => void;
    onClose: () => void;
    type?: 'link' | 'button';
    value?: string;
}

const AllSearchList = ({ onDismiss, onClose, type, value }: Props) => {
    const router = useRouter();
    const enabled = value !== undefined && value.length >= MIN_SEARCH_LENGTH;

    const anime = useSearchAnimes({
        args: { query: value },
        paginationArgs: { size: ALL_SEARCH_SIZE },
        queryKey: ['all-search-anime', value],
        options: { enabled },
    });

    const manga = useSearchMangas({
        args: { query: value },
        paginationArgs: { size: ALL_SEARCH_SIZE },
        queryKey: ['all-search-manga', value],
        options: { enabled },
    });

    const novel = useSearchNovels({
        args: { query: value },
        paginationArgs: { size: ALL_SEARCH_SIZE },
        queryKey: ['all-search-novel', value],
        options: { enabled },
    });

    const characters = useSearchCharacters({
        args: { query: value },
        paginationArgs: { size: ALL_SEARCH_SIZE },
        queryKey: ['all-search-characters', value],
        options: { enabled },
    });

    const people = useSearchPeople({
        args: { query: value },
        paginationArgs: { size: ALL_SEARCH_SIZE },
        queryKey: ['all-search-people', value],
        options: { enabled },
    });

    const anyFetching =
        anime.isFetching ||
        manga.isFetching ||
        novel.isFetching ||
        characters.isFetching ||
        people.isFetching;

    const anyRefetching =
        anime.isRefetching ||
        manga.isRefetching ||
        novel.isRefetching ||
        characters.isRefetching ||
        people.isRefetching;

    const allLists = [
        anime.list,
        manga.list,
        novel.list,
        characters.list,
        people.list,
    ];
    const hasAnyData = allLists.some((list) => list !== undefined);
    const allEmpty =
        hasAnyData && allLists.every((list) => !list || list.length === 0);

    const placeholderData = !hasAnyData ? undefined : allEmpty ? [] : [1];

    const handleNavigate = useCallback(
        (path: string) => {
            onClose();
            router.push(
                value ? `${path}?search=${encodeURIComponent(value)}` : path,
            );
        },
        [onClose, router, value],
    );

    const handleSelectAnime = useCallback(
        (item: MainContent) => {
            onDismiss(item);
            if (type !== 'button') router.push('/anime/' + item.slug);
        },
        [onDismiss, router, type],
    );

    const handleSelectManga = useCallback(
        (item: MainContent) => {
            onDismiss(item);
            if (type !== 'button') router.push('/manga/' + item.slug);
        },
        [onDismiss, router, type],
    );

    const handleSelectNovel = useCallback(
        (item: MainContent) => {
            onDismiss(item);
            if (type !== 'button') router.push('/novel/' + item.slug);
        },
        [onDismiss, router, type],
    );

    const handleSelectCharacter = useCallback(
        (item: MainContent) => {
            onDismiss(item);
            if (type !== 'button') router.push('/characters/' + item.slug);
        },
        [onDismiss, router, type],
    );

    const handleSelectPerson = useCallback(
        (item: MainContent) => {
            onDismiss(item);
            if (type !== 'button') router.push('/people/' + item.slug);
        },
        [onDismiss, router, type],
    );

    return (
        <CommandList className="max-h-none py-1">
            <SearchPlaceholders
                data={placeholderData}
                isFetching={anyFetching}
                isRefetching={anyRefetching}
            />

            {anime.list && anime.list.length > 0 && (
                <CommandGroup
                    heading="Аніме"
                    className="p-0! **:[[cmdk-group-heading]]:px-3!"
                >
                    {anime.list.map((item) => (
                        <CommandItem
                            key={`anime-${item.slug}`}
                            value={`anime-${item.slug}`}
                            className="rounded-none! px-3! border-t first:border-t-0"
                            onSelect={() => handleSelectAnime(item)}
                        >
                            <AnimeCard
                                onClick={() => onDismiss(item)}
                                anime={item}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                    <CommandItem
                        value="view-all-anime"
                        onSelect={() => handleNavigate('/anime')}
                        className="justify-center border-y rounded-none text-muted-foreground"
                    >
                        <Ellipsis />
                        Показати всі результати
                    </CommandItem>
                </CommandGroup>
            )}

            {manga.list && manga.list.length > 0 && (
                <CommandGroup
                    heading="Манґа"
                    className="p-0! **:[[cmdk-group-heading]]:px-3!"
                >
                    {manga.list.map((item) => (
                        <CommandItem
                            key={`manga-${item.slug}`}
                            value={`manga-${item.slug}`}
                            className="rounded-none! px-3! border-t first:border-t-0"
                            onSelect={() => handleSelectManga(item)}
                        >
                            <MangaCard
                                onClick={() => onDismiss(item)}
                                manga={item}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                    <CommandItem
                        value="view-all-manga"
                        onSelect={() => handleNavigate('/manga')}
                        className="justify-center border-y rounded-none text-muted-foreground"
                    >
                        <Ellipsis />
                        Показати всі результати
                    </CommandItem>
                </CommandGroup>
            )}

            {novel.list && novel.list.length > 0 && (
                <CommandGroup
                    heading="Ранобе"
                    className="p-0! **:[[cmdk-group-heading]]:px-3!"
                >
                    {novel.list.map((item) => (
                        <CommandItem
                            key={`novel-${item.slug}`}
                            value={`novel-${item.slug}`}
                            className="rounded-none! px-3! border-t first:border-t-0"
                            onSelect={() => handleSelectNovel(item)}
                        >
                            <NovelCard
                                onClick={() => onDismiss(item)}
                                novel={item}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                    <CommandItem
                        value="view-all-novel"
                        onSelect={() => handleNavigate('/novel')}
                        className="justify-center border-y rounded-none text-muted-foreground"
                    >
                        <Ellipsis />
                        Показати всі результати
                    </CommandItem>
                </CommandGroup>
            )}

            {characters.list && characters.list.length > 0 && (
                <CommandGroup
                    heading="Персонажі"
                    className="p-0! **:[[cmdk-group-heading]]:px-3!"
                >
                    {characters.list.map((item) => (
                        <CommandItem
                            key={`character-${item.slug}`}
                            value={`character-${item.slug}`}
                            className="rounded-none! px-3! border-t first:border-t-0"
                            onSelect={() => handleSelectCharacter(item)}
                        >
                            <CharacterCard
                                onClick={() => onDismiss(item)}
                                character={item}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                    <CommandItem
                        value="view-all-characters"
                        onSelect={() => handleNavigate('/characters')}
                        className="justify-center border-y rounded-none text-muted-foreground"
                    >
                        <Ellipsis />
                        Показати всі результати
                    </CommandItem>
                </CommandGroup>
            )}

            {people.list && people.list.length > 0 && (
                <CommandGroup
                    heading="Люди"
                    className="p-0! **:[[cmdk-group-heading]]:px-3!"
                >
                    {people.list.map((item) => (
                        <CommandItem
                            key={`person-${item.slug}`}
                            value={`person-${item.slug}`}
                            className="rounded-none! px-3! border-t first:border-t-0"
                            onSelect={() => handleSelectPerson(item)}
                        >
                            <PersonCard
                                onClick={() => onDismiss(item)}
                                person={item}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                    <CommandItem
                        value="view-all-people"
                        onSelect={() => handleNavigate('/people')}
                        className="justify-center border-y rounded-none text-muted-foreground"
                    >
                        <Ellipsis />
                        Показати всі результати
                    </CommandItem>
                </CommandGroup>
            )}
        </CommandList>
    );
};

export default AllSearchList;
