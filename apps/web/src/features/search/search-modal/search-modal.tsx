import {
    type FC,
    Fragment,
    type ReactNode,
    useCallback,
    useRef,
    useState,
} from 'react';

import { CircleX } from 'lucide-react';

import { ContentTypeEnum } from '@hikka/api';

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
import { SEARCH_ENTITY_BY_TYPE } from './search-entities';
import {
    SEARCH_TYPE_ALL,
    type SearchEntityType,
    type SearchResult,
    type SearchResultVariant,
    type SearchTypeValue,
} from './types';

type Props = {
    onClick?: (content: SearchResult) => void;
    type?: SearchResultVariant;
    children?: ReactNode;
    content_type?: SearchEntityType;
    allowedTypes?: SearchEntityType[];
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
        delay: 500,
    });

    const addHistoryEntry = useSearchHistoryStore((state) => state.addEntry);
    const hasHistoryEntries = useSearchHistoryStore(
        (state) => state.entries.length > 0,
    );

    const onDismiss = useCallback(
        (content: SearchResult) => {
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

    const onCloseResults = useCallback(() => {
        setSearchValue('');
        setOpen(false);
    }, [setOpen]);

    const showHistory =
        hasHistoryEntries && (!searchValue || searchValue.trim().length === 0);

    // `all` has no entity of its own; every other type resolves to exactly one.
    const renderResults = () => {
        if (searchType === SEARCH_TYPE_ALL) {
            return (
                <AllSearchList
                    onDismiss={onDismiss}
                    onClose={onCloseResults}
                    onSwitchType={setSearchType}
                    allowedTypes={allowedTypes}
                    value={value}
                    type={type}
                />
            );
        }

        const entity = SEARCH_ENTITY_BY_TYPE[searchType];

        // Users get their own list: `/user/list` answers with a bare array, so
        // the entry carries no infinite options.
        if (entity.type === ContentTypeEnum.USER) {
            return (
                <UserSearchList
                    entity={entity}
                    onDismiss={onDismiss}
                    value={value}
                    type={type}
                />
            );
        }

        // Everything else is paginated; `options` is optional on the registry
        // entry only because of the user entry above.
        if (!entity.options) return null;

        return (
            <EntitySearchList
                entity={entity}
                options={entity.options}
                onDismiss={onDismiss}
                onClose={onCloseResults}
                value={value}
                type={type}
            />
        );
    };

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

                        {renderResults()}
                    </Fragment>
                )}
            </CommandDialog>
        </Fragment>
    );
};

export default SearchModal;
