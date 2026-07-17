import {
    type FC,
    Fragment,
    type ReactNode,
    useCallback,
    useRef,
    useState,
} from 'react';

import { CircleX } from 'lucide-react';

import type { ContentTypeEnum, UserResponse } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import useDebounce from '@/services/hooks/use-debounce';
import {
    type SearchHistoryEntry,
    useSearchHistoryStore,
} from '@/services/stores/search-history-store';
import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import SearchButton from './components/search-button';
import AllSearchList from './components/search-lists/all-search-list';
import EntitySearchList from './components/search-lists/entity-search-list';
import SearchHistoryList from './components/search-lists/search-history-list';
import UserSearchList from './components/search-lists/user-search-list';
import SearchToggle from './components/search-toggle';
import useSearchModal from './hooks/use-search-modal';
import {
    SEARCH_TYPE_ALL,
    type SearchContent,
    type SearchTypeValue,
} from './types';

type Props = {
    onClick?: (content: SearchContent | UserResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    content_type?: ContentTypeEnum;
    allowedTypes?: ContentTypeEnum[];
};

const SearchModal: FC<Props> = ({
    onClick,
    type,
    content_type,
    children,
    allowedTypes,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchType, setSearchType] = useState<SearchTypeValue>(
        content_type || SEARCH_TYPE_ALL,
    );
    const [open, setOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const value = useDebounce({
        value: searchValue,
        delay: 500,
    });

    const addHistoryEntry = useSearchHistoryStore((state) => state.addEntry);
    const hasHistoryEntries = useSearchHistoryStore(
        (state) => state.entries.length > 0,
    );

    const onDismiss = useCallback(
        (content: SearchContent | UserResponse) => {
            if (searchValue && searchValue.trim().length >= MIN_SEARCH_LENGTH) {
                addHistoryEntry(searchValue, searchType);
            }

            setSearchValue('');
            setOpen(false);

            onClick?.(content);
        },
        [addHistoryEntry, onClick, searchType, searchValue],
    );

    const handleOpenChange = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            setSearchValue('');
        }
        setOpen(isOpen);
    }, []);

    const handleHistorySelect = useCallback(
        (entry: SearchHistoryEntry) => {
            if (
                !content_type &&
                (entry.type === SEARCH_TYPE_ALL ||
                    !allowedTypes ||
                    allowedTypes.includes(entry.type))
            ) {
                setSearchType(entry.type);
            }

            setSearchValue(entry.query);
            inputRef.current?.focus();
        },
        [allowedTypes, content_type],
    );

    const showHistory =
        hasHistoryEntries && (!searchValue || searchValue.trim().length === 0);

    useSearchModal({ open, setOpen, onClick, content_type, setSearchType });

    return (
        <Fragment>
            <SearchButton setOpen={setOpen}>{children}</SearchButton>
            <CommandDialog
                className="top-24 max-h-[calc(var(--visual-viewport-height,100dvh)-6rem-1rem)] translate-y-0 transition-[max-height] duration-100 md:max-w-2xl"
                open={open}
                onOpenChange={handleOpenChange}
                shouldFilter={false}
            >
                <CommandInput
                    ref={inputRef}
                    value={searchValue}
                    onValueChange={(value) => setSearchValue(value)}
                    placeholder="Пошук..."
                    autoFocus
                    containerClassName="dark:bg-secondary/20 gap-3"
                    leftSideNode={
                        <SearchToggle
                            allowedTypes={allowedTypes}
                            inputRef={inputRef}
                            disabled={Boolean(content_type)}
                            setType={setSearchType}
                            type={searchType}
                        />
                    }
                >
                    <Button
                        onClick={() => {
                            setSearchValue('');
                            inputRef.current?.focus();
                        }}
                        size="icon-sm"
                        variant="ghost"
                        disabled={!searchValue || searchValue?.length === 0}
                        className="shrink-0 text-muted-foreground"
                    >
                        <CircleX />
                    </Button>
                </CommandInput>

                {showHistory ? (
                    <SearchHistoryList onSelect={handleHistorySelect} />
                ) : (
                    <Fragment>
                        <SearchHistoryList
                            onSelect={handleHistorySelect}
                            query={searchValue}
                        />

                        {searchType === 'all' && (
                            <AllSearchList
                                onDismiss={onDismiss}
                                onClose={() => {
                                    setSearchValue('');
                                    setOpen(false);
                                }}
                                onSwitchType={setSearchType}
                                value={value}
                                type={type}
                            />
                        )}

                        {(searchType === 'anime' ||
                            searchType === 'manga' ||
                            searchType === 'novel' ||
                            searchType === 'character' ||
                            searchType === 'person') && (
                            <EntitySearchList
                                contentType={searchType}
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
                    </Fragment>
                )}
            </CommandDialog>
        </Fragment>
    );
};

export default SearchModal;
