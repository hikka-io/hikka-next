import { useCallback } from 'react';

import { Ellipsis } from 'lucide-react';

import LoadMoreButton from '@/components/load-more-button';
import { CommandItem } from '@/components/ui/command';
import { useSearchHistoryStore } from '@/services/stores/search-history-store';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import type {
    SearchEntity,
    SearchEntityOptionsFn,
} from '../../search-entities';
import type { SearchResult, SearchResultVariant } from '../../types';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

type Props = {
    entity: SearchEntity;
    /**
     * `entity.options`, handed over separately so the caller's narrowing of the
     * optional field survives the prop hop — it does not travel with `entity`.
     */
    options: SearchEntityOptionsFn;
    onDismiss: (content: SearchResult) => void;
    onClose: () => void;
    type?: SearchResultVariant;
    value?: string;
};

const EntitySearchList = ({
    entity,
    options,
    onDismiss,
    onClose,
    type,
    value,
}: Props) => {
    const router = useRouter();
    const addHistoryEntry = useSearchHistoryStore((state) => state.addEntry);

    const handleSelect = useCallback(
        (item: SearchResult) => {
            onDismiss(item);

            const href = entity.getHref(item);
            if (type !== 'button' && href) {
                router.push(href);
            }
        },
        [onDismiss, router, type, entity],
    );

    const handleNavigate = useCallback(() => {
        if (value && value.trim().length >= MIN_SEARCH_LENGTH) {
            addHistoryEntry(value);
        }

        onClose();
        router.push(
            entity.routePrefix,
            value ? { search: { search: value } } : undefined,
        );
    }, [addHistoryEntry, onClose, router, value, entity]);

    const {
        list,
        isFetching,
        isRefetching,
        ref,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList(
        options({
            body: { query: value },
            query: { size: 30 },
        }),
        {
            enabled: value !== undefined && value.length >= MIN_SEARCH_LENGTH,
        },
    );

    return (
        <SearchList>
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <SearchGroup>
                    {list.map((item) => {
                        const href = entity.getHref(item);
                        // No href means nothing to link to or key on.
                        if (!href) return null;

                        return (
                            <SearchItem
                                key={href}
                                value={href}
                                onSelect={() => handleSelect(item)}
                            >
                                {entity.renderCard(item, href, type)}
                            </SearchItem>
                        );
                    })}
                    {entity.hasCatalog && type !== 'button' && (
                        <CommandItem
                            value={`view-all-${entity.type}`}
                            onSelect={handleNavigate}
                            className="justify-center rounded-none border-y text-muted-foreground"
                        >
                            <Ellipsis />
                            Показати всі результати
                        </CommandItem>
                    )}
                </SearchGroup>
            )}
            <div className="flex items-center justify-center">
                {hasNextPage && (
                    <LoadMoreButton
                        ref={ref}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                )}
            </div>
        </SearchList>
    );
};

export default EntitySearchList;
