'use client';

import * as React from 'react';
import { ReactNode, useRef, useState } from 'react';

import CharacterSearchList from '@/components/modals/search-modal/components/character-search-list';
import PersonSearchList from '@/components/modals/search-modal/components/person-search-list';
import UserSearchList from '@/components/modals/search-modal/components/user-search-list';

import SearchToggle from '@/components/modals/search-modal/components/search-toggle';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import useDebounce from '@/services/hooks/useDebounce';

import AnimeSearchList from './components/anime-search-list';
import SearchButton from './components/search-button';
import useSearchModal from './components/useSearchModal';

interface Props {
    onClick?: (content: API.MainContent) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    content_type?: API.ContentType;
}

const SearchModal = ({ onClick, type, content_type, children }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchType, setSearchType] = useState<API.ContentType>(
        content_type || 'anime',
    );
    const [open, setOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const value = useDebounce({ value: searchValue, delay: 500 });

    const onDismiss = (content: API.MainContent) => {
        setSearchValue('');
        setOpen(false);

        onClick && onClick(content);
    };

    useSearchModal({ setOpen, onClick, content_type, setSearchType });

    return (
        <>
            <SearchButton setOpen={setOpen}>{children}</SearchButton>
            <CommandDialog
                className="flex max-h-[90dvh] max-w-3xl"
                open={open}
                onOpenChange={setOpen}
                shouldFilter={false}
            >
                <div className="flex p-3 dark:bg-secondary/30">
                    <SearchToggle
                        inputRef={inputRef}
                        disabled={Boolean(content_type)}
                        setType={setSearchType}
                        type={searchType}
                    />
                </div>
                <CommandInput
                    ref={inputRef}
                    value={searchValue}
                    onValueChange={(value) => setSearchValue(value)}
                    placeholder="Пошук..."
                    autoFocus
                    containerClassName="dark:bg-secondary/30"
                />

                {searchType === 'anime' && (
                    <AnimeSearchList
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
        </>
    );
};

export default SearchModal;
