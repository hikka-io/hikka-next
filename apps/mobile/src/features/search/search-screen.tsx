import { type FC, useState } from 'react';

import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';

import EmptyState from '@/components/ui/empty-state';
import { DEBOUNCE_MS, useDebouncedValue } from '@/services/use-debounced-value';

import SearchAll from './search-all';
import SearchList from './search-list';
import { type SearchScope, searchQuery } from './search-scope';
import SearchScopeChips from './search-scope-chips';

/** The web's search modal as the search tab: header search field, scope chips, results. */
const SearchScreen: FC = () => {
    const [text, setText] = useState('');
    const [scope, setScope] = useState<SearchScope>('all');
    const debounced = useDebouncedValue(text, DEBOUNCE_MS.commit);

    const chips = <SearchScopeChips scope={scope} onChange={setScope} />;
    const query =
        scope === 'all'
            ? searchQuery(debounced, ContentTypeEnum.ANIME)
            : searchQuery(debounced, scope);

    const searchBar = (
        <Stack.SearchBar
            placeholder="Пошук..."
            autoCapitalize="none"
            onChangeText={(event) => setText(event.nativeEvent.text)}
            onCancelButtonPress={() => setText('')}
        />
    );

    if (query === null || scope === 'all') {
        return (
            <>
                {searchBar}
                <ScrollView
                    className="flex-1 bg-background"
                    contentInsetAdjustmentBehavior="automatic"
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                >
                    {chips}
                    {query === null ? (
                        <EmptyState
                            className="mt-8"
                            title="Введіть назву, щоб розпочати пошук..."
                        />
                    ) : (
                        <SearchAll text={debounced} onShowAll={setScope} />
                    )}
                </ScrollView>
            </>
        );
    }

    return (
        <>
            {searchBar}
            <SearchList
                key={`${scope}:${query}`}
                type={scope}
                query={query}
                header={chips}
            />
        </>
    );
};

export default SearchScreen;
