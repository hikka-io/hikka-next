'use client';

import { ContentTypeEnum, MainContent, UserResponse } from '@hikka/client';
import { FC, Fragment, ReactNode, useRef, useState } from 'react';

import { CommandDialog, CommandInput } from '@/components/ui/command';

import useDebounce from '@/services/hooks/use-debounce';
import { convertLayout } from '@/utils/keyboard-layout';

import SearchButton from './components/search-button';
import AnimeSearchList from './components/search-lists/anime-search-list';
import CharacterSearchList from './components/search-lists/character-search-list';
import MangaSearchList from './components/search-lists/manga-search-list';
import NovelSearchList from './components/search-lists/novel-search-list';
import PersonSearchList from './components/search-lists/person-search-list';
import UserSearchList from './components/search-lists/user-search-list';
import SearchToggle from './components/search-toggle';
import useSearchModal from './hooks/useSearchModal';

interface Props {
    onClick?: (content: MainContent | UserResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    content_type?: ContentTypeEnum;
    allowedTypes?: ContentTypeEnum[];
}

const SearchModal: FC<Props> = ({
    onClick,
    type,
    content_type,
    children,
    allowedTypes,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchType, setSearchType] = useState<ContentTypeEnum>(
        content_type || ContentTypeEnum.ANIME,
    );
    const [open, setOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const value = useDebounce({
        value: convertLayout(searchValue),
        delay: 500,
    });

    const onDismiss = (content: MainContent | UserResponse) => {
        setSearchValue('');
        setOpen(false);

        onClick && onClick(content);
    };

    useSearchModal({ open, setOpen, onClick, content_type, setSearchType });

    return (
        <Fragment>
            <SearchButton setOpen={setOpen}>{children}</SearchButton>
            <CommandDialog
                className="mt-16 flex max-h-[80dvh] max-w-3xl"
                containerClassName="p-0"
                overlayClassName="items-start"
                open={open}
                onOpenChange={setOpen}
                shouldFilter={false}
            >
                <CommandInput
                    ref={inputRef}
                    value={searchValue}
                    onValueChange={(value) => setSearchValue(value)}
                    placeholder="Пошук..."
                    autoFocus
                    containerClassName="dark:bg-secondary/20 gap-3"
                >
                    <SearchToggle
                        allowedTypes={allowedTypes}
                        inputRef={inputRef}
                        disabled={Boolean(content_type)}
                        setType={setSearchType}
                        type={searchType}
                    />
                </CommandInput>

                {searchType === 'anime' && (
                    <AnimeSearchList
                        onDismiss={onDismiss}
                        value={value}
                        type={type}
                    />
                )}

                {searchType === 'manga' && (
                    <MangaSearchList
                        onDismiss={onDismiss}
                        value={value}
                        type={type}
                    />
                )}

                {searchType === 'novel' && (
                    <NovelSearchList
                        onDismiss={onDismiss}
                        value={value}
                        type={type}
                    />
                )}

                {searchType === 'character' && (
                    <CharacterSearchList
                        onDismiss={onDismiss}
                        value={value}
                        type={type}
                    />
                )}

                {searchType === 'person' && (
                    <PersonSearchList
                        onDismiss={onDismiss}
                        value={value}
                        type={type}
                    />
                )}

                {searchType === 'user' && (
                    <UserSearchList
                        onDismiss={onDismiss}
                        value={value}
                        type={type}
                    />
                )}
            </CommandDialog>
        </Fragment>
    );
};

export default SearchModal;
