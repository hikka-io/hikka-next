'use client';

import { FC, Fragment, ReactNode, useRef, useState } from 'react';

import { CommandDialog, CommandInput } from '@/components/ui/command';

import CharacterSearchList from '@/features/modals/search-modal/character-search-list';
import PersonSearchList from '@/features/modals/search-modal/person-search-list';
import SearchToggle from '@/features/modals/search-modal/search-toggle';
import UserSearchList from '@/features/modals/search-modal/user-search-list';

import useDebounce from '@/services/hooks/use-debounce';

import AnimeSearchList from './anime-search-list';
import useSearchModal from './hooks/useSearchModal';
import MangaSearchList from './manga-search-list';
import NovelSearchList from './novel-search-list';
import SearchButton from './search-button';

interface Props {
    onClick?: (content: API.MainContent | API.User) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    content_type?: API.ContentType;
    allowedTypes?: (API.ContentType | 'user')[];
}

const SearchModal: FC<Props> = ({
    onClick,
    type,
    content_type,
    children,
    allowedTypes,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchType, setSearchType] = useState<API.ContentType | 'user'>(
        content_type || 'anime',
    );
    const [open, setOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const value = useDebounce(searchValue, 500);

    const onDismiss = (content: API.MainContent | API.User) => {
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
                    containerClassName="dark:bg-secondary/30 gap-3"
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
