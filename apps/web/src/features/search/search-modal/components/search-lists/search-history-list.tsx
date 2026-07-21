import { Trash2, X } from 'lucide-react';

import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import { Button } from '@/components/ui/button';
import { CommandItem } from '@/components/ui/command';
import {
    type SearchHistoryEntry,
    useSearchHistoryStore,
} from '@/services/stores/search-history-store';

import { SearchGroup, SearchItem, SearchList } from '../search-ui';

const MAX_HISTORY_SUGGESTIONS = 3;

type Props = {
    onSelect: (entry: SearchHistoryEntry) => void;
    query?: string;
};

const SearchHistoryList = ({ onSelect, query }: Props) => {
    const entries = useSearchHistoryStore((state) => state.entries);
    const removeEntry = useSearchHistoryStore((state) => state.removeEntry);
    const clearHistory = useSearchHistoryStore((state) => state.clearHistory);

    // While typing, history acts as suggestions filtered by the current input:
    // prefix matches first, then freshest entries (store order), capped in size
    const normalizedQuery = query?.trim().toLowerCase();
    const filteredEntries = normalizedQuery
        ? entries
              .filter((entry) =>
                  entry.query.toLowerCase().includes(normalizedQuery),
              )
              .sort(
                  (a, b) =>
                      Number(
                          b.query.toLowerCase().startsWith(normalizedQuery),
                      ) -
                      Number(a.query.toLowerCase().startsWith(normalizedQuery)),
              )
              .slice(0, MAX_HISTORY_SUGGESTIONS)
        : entries;

    if (filteredEntries.length === 0) return null;

    return (
        <SearchList
            className={normalizedQuery ? 'shrink-0 border-b' : undefined}
        >
            <SearchGroup heading="Історія пошуку">
                {filteredEntries.map((entry) => (
                    <SearchItem
                        key={entry.query}
                        value={`history-${entry.query}`}
                        onSelect={() => onSelect(entry)}
                    >
                        <MaterialSymbolsHistoryRounded className="text-muted-foreground" />
                        <span className="flex-1 truncate">{entry.query}</span>
                        <Button
                            type="button"
                            size="icon-xs"
                            variant="ghost"
                            className="shrink-0 text-muted-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeEntry(entry.query);
                            }}
                        >
                            <X />
                        </Button>
                    </SearchItem>
                ))}
                {!normalizedQuery && (
                    <CommandItem
                        value="clear-search-history"
                        onSelect={clearHistory}
                        className="justify-center rounded-none border-y text-muted-foreground"
                    >
                        <Trash2 />
                        Очистити історію
                    </CommandItem>
                )}
            </SearchGroup>
        </SearchList>
    );
};

export default SearchHistoryList;
