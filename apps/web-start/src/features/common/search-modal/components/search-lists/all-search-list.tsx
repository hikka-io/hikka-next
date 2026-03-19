'use client';

import { ContentTypeEnum, MainContent } from '@hikka/client';
import {
    useSearchAnimes,
    useSearchCharacters,
    useSearchMangas,
    useSearchNovels,
    useSearchPeople,
} from '@hikka/react';
import { Ellipsis } from 'lucide-react';
import { ReactNode, useCallback } from 'react';

import { CommandItem } from '@/components/ui/command';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import AnimeCard from '../cards/anime-card';
import CharacterCard from '../cards/character-card';
import MangaCard from '../cards/manga-card';
import NovelCard from '../cards/novel-card';
import PersonCard from '../cards/person-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

const ALL_SEARCH_SIZE = 3;

interface SearchResultGroupProps {
    list: Array<{ slug: string }> | undefined;
    heading: string;
    contentType: ContentTypeEnum;
    renderCard: (item: any) => ReactNode;
    onSelect: (item: any) => void;
    onNavigate: () => void;
}

const SearchResultGroup = ({
    list,
    heading,
    contentType,
    renderCard,
    onSelect,
    onNavigate,
}: SearchResultGroupProps) => {
    if (!list || list.length === 0) return null;

    return (
        <SearchGroup heading={heading}>
            {list.map((item) => (
                <SearchItem
                    key={`${contentType}-${item.slug}`}
                    value={`${contentType}-${item.slug}`}
                    onSelect={() => onSelect(item)}
                >
                    {renderCard(item)}
                </SearchItem>
            ))}
            <CommandItem
                value={`view-all-${contentType}`}
                onSelect={onNavigate}
                className="text-muted-foreground justify-center rounded-none border-y"
            >
                <Ellipsis />
                Показати всі результати
            </CommandItem>
        </SearchGroup>
    );
};

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

    const handleSelect = useCallback(
        (item: MainContent, contentType: ContentTypeEnum) => {
            onDismiss(item);
            if (type !== 'button') {
                router.push(
                    CONTENT_TYPE_LINKS[contentType] + '/' + item.slug,
                );
            }
        },
        [onDismiss, router, type],
    );

    const handleNavigate = useCallback(
        (contentType: ContentTypeEnum) => {
            onClose();
            const path = CONTENT_TYPE_LINKS[contentType];
            router.push(
                value ? `${path}?search=${encodeURIComponent(value)}` : path,
            );
        },
        [onClose, router, value],
    );

    return (
        <SearchList className="py-1">
            <SearchPlaceholders
                data={placeholderData}
                isFetching={anyFetching}
                isRefetching={anyRefetching}
            />

            <SearchResultGroup
                list={anime.list}
                heading="Аніме"
                contentType={ContentTypeEnum.ANIME}
                onSelect={(item) =>
                    handleSelect(item, ContentTypeEnum.ANIME)
                }
                onNavigate={() => handleNavigate(ContentTypeEnum.ANIME)}
                renderCard={(item) => (
                    <AnimeCard
                        onClick={() => onDismiss(item)}
                        anime={item}
                        type={type}
                    />
                )}
            />

            <SearchResultGroup
                list={manga.list}
                heading="Манґа"
                contentType={ContentTypeEnum.MANGA}
                onSelect={(item) =>
                    handleSelect(item, ContentTypeEnum.MANGA)
                }
                onNavigate={() => handleNavigate(ContentTypeEnum.MANGA)}
                renderCard={(item) => (
                    <MangaCard
                        onClick={() => onDismiss(item)}
                        manga={item}
                        type={type}
                    />
                )}
            />

            <SearchResultGroup
                list={novel.list}
                heading="Ранобе"
                contentType={ContentTypeEnum.NOVEL}
                onSelect={(item) =>
                    handleSelect(item, ContentTypeEnum.NOVEL)
                }
                onNavigate={() => handleNavigate(ContentTypeEnum.NOVEL)}
                renderCard={(item) => (
                    <NovelCard
                        onClick={() => onDismiss(item)}
                        novel={item}
                        type={type}
                    />
                )}
            />

            <SearchResultGroup
                list={characters.list}
                heading="Персонажі"
                contentType={ContentTypeEnum.CHARACTER}
                onSelect={(item) =>
                    handleSelect(item, ContentTypeEnum.CHARACTER)
                }
                onNavigate={() =>
                    handleNavigate(ContentTypeEnum.CHARACTER)
                }
                renderCard={(item) => (
                    <CharacterCard
                        onClick={() => onDismiss(item)}
                        character={item}
                        type={type}
                    />
                )}
            />

            <SearchResultGroup
                list={people.list}
                heading="Люди"
                contentType={ContentTypeEnum.PERSON}
                onSelect={(item) =>
                    handleSelect(item, ContentTypeEnum.PERSON)
                }
                onNavigate={() => handleNavigate(ContentTypeEnum.PERSON)}
                renderCard={(item) => (
                    <PersonCard
                        onClick={() => onDismiss(item)}
                        person={item}
                        type={type}
                    />
                )}
            />
        </SearchList>
    );
};

export default AllSearchList;
