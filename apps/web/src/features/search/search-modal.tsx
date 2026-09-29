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
import { DEBOUNCE_MS, useDebounce } from '@/services/hooks/use-debounce';
import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import SearchButton from './components/search-button';
import SearchToggle from './components/search-toggle';
import {
    type SearchHistoryEntry,
    useSearchHistoryStore,
} from './search-history-store';
import AllSearchList from './search-lists/all-search-list';
import EntitySearchList from './search-lists/entity-search-list';
import SearchHistoryList from './search-lists/search-history-list';
import UserSearchList from './search-lists/user-search-list';
import {
    SEARCH_TYPE_ALL,
    type SearchContent,
    type SearchTypeValue,
} from './types';
import { useSearchModal } from './use-search-modal';

type Props = {
    onClick?: (content: SearchContent | UserResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    content_type?: ContentTypeEnum;
    allowedTypes?: ContentTypeEnum[];
    disableHotkey?: boolean;
    /** Controlled mode: the caller owns the state and renders its own trigger. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

const SearchModal: FC<Props> = ({
    onClick,
    type,
    content_type,
    children,
    allowedTypes,
    disableHotkey,
    open: openProp,
    onOpenChange,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchType, setSearchType] = useState<SearchTypeValue>(
        content_type || SEARCH_TYPE_ALL,
    );
    const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(false);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : uncontrolledOpen;

    const setOpen = useCallback(
        (next: boolean) => {
            if (!isControlled) setUncontrolledOpen(next);
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
    );
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const [value, setDebouncedValue] = useDebounce({
        value: searchValue,
        delay: DEBOUNCE_MS.commit,
    });

    const addHistoryEntry = useSearchHistoryStore((state) => state.addEntry);
    const hasHistoryEntries = useSearchHistoryStore(
        (state) => state.entries.length > 0,
    );

    const onDismiss = useCallback(
        (content: SearchContent | UserResponse) => {
            if (searchValue && searchValue.trim().length >= MIN_SEARCH_LENGTH) {
                addHistoryEntry(searchValue);
            }

            setSearchValue('');
            setOpen(false);

            onClick?.(content);
        },
        [addHistoryEntry, onClick, searchValue, setOpen],
    );

    const handleOpenChange = useCallback(
        (isOpen: boolean) => {
            if (!isOpen) {
                setSearchValue('');
            }
            setOpen(isOpen);
        },
        [setOpen],
    );

    const handleHistorySelect = useCallback(
        (entry: SearchHistoryEntry) => {
            setSearchValue(entry.query);
            // Skip the debounce wait so results start loading immediately
            setDebouncedValue(entry.query);
            inputRef.current?.focus();
        },
        [setDebouncedValue],
    );

    const showHistory =
        hasHistoryEntries && (!searchValue || searchValue.trim().length === 0);

    useSearchModal({
        open,
        setOpen,
        onClick,
        content_type,
        setSearchType,
        disableHotkey,
    });

    return (
        <Fragment>
            {!isControlled && (
                <SearchButton setOpen={setOpen}>{children}</SearchButton>
            )}
            <CommandDialog
                className="max-h-[calc(var(--visual-viewport-height,100dvh)-6rem)] transition-[max-height,opacity,scale] md:top-24 md:max-h-[calc(var(--visual-viewport-height,100dvh)-6rem-1rem)] md:max-w-2xl md:translate-y-0"
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
                                onClose={() => {
                                    setSearchValue('');
                                    setOpen(false);
                                }}
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
