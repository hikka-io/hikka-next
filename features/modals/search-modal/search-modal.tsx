'use client';

import { usePathname } from 'next/navigation';
import { Fragment, ReactNode, useRef, useState } from 'react';

import { CommandDialog, CommandInput } from '@/components/ui/command';

import CharacterSearchList from '@/features/modals/search-modal/character-search-list';
import PersonSearchList from '@/features/modals/search-modal/person-search-list';
import SearchToggle from '@/features/modals/search-modal/search-toggle';
import UserSearchList from '@/features/modals/search-modal/user-search-list';

import useDebounce from '@/services/hooks/use-debounce';

import AnimeSearchList from './anime-search-list';
import SearchButton from './search-button';
import useSearchModal from './useSearchModal';

interface Props {
    onClick?: (content: API.MainContent | API.User) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    content_type?: API.ContentType;
}

const SearchModal = ({ onClick, type, content_type, children }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [content_type_page, setContentTypePage] = useState(
        usePathname().split('/')[1],
    );
    const [searchType, setSearchType] = useState<API.ContentType | 'user'>(
        content_type || content_type_page === 'characters'
            ? 'character'
            : content_type_page === 'people'
              ? 'person'
              : content_type_page === 'users'
                ? 'user'
                : 'anime',
    );
    const [open, setOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const value = useDebounce({ value: searchValue, delay: 500 });

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
                className="flex max-h-[90dvh] max-w-3xl"
                containerClassName="p-0"
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
        </Fragment>
    );
};

export default SearchModal;
