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

import SearchButton from './components/search-button';
import AllSearchList from './components/search-lists/all-search-list';
import EntitySearchList from './components/search-lists/entity-search-list';
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

    const onDismiss = useCallback(
        (content: SearchContent | UserResponse) => {
            setSearchValue('');
            setOpen(false);

            onClick?.(content);
        },
        [onClick],
    );

    const handleOpenChange = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            setSearchValue('');
        }
        setOpen(isOpen);
    }, []);

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

                {searchType === 'all' && (
                    <AllSearchList
                        onDismiss={onDismiss}
                        onClose={() => {
                            setSearchValue('');
                            setOpen(false);
                        }}
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
            </CommandDialog>
        </Fragment>
    );
};

export default SearchModal;
