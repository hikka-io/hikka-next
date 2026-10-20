import { type FC, useRef } from 'react';

import * as Haptics from 'expo-haptics';
import { ScrollView } from 'react-native';

import { Chip } from '@/components/ui/chip';

import {
    SEARCH_SCOPE_LABELS,
    SEARCH_SCOPES,
    type SearchScope,
} from './search-scope';

type Props = {
    scope: SearchScope;
    onChange: (scope: SearchScope) => void;
};

/** The web's search type toggle as a chip row (`ChipTabs`): seven options are too many for a segmented control. */
const SearchScopeChips: FC<Props> = ({ scope, onChange }) => {
    const scrollRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4 pb-2"
        >
            {SEARCH_SCOPES.map((item) => (
                <Chip
                    key={item}
                    selected={scope === item}
                    className={scope === item ? undefined : 'bg-secondary'}
                    onLayout={(event) => {
                        // The row remounts when the result list changes; keep the selected scope in view.
                        if (item !== scope) return;
                        scrollRef.current?.scrollTo({
                            x: Math.max(0, event.nativeEvent.layout.x - 16),
                            animated: false,
                        });
                    }}
                    onPress={() => {
                        if (item === scope) return;
                        Haptics.selectionAsync();
                        onChange(item);
                    }}
                >
                    {SEARCH_SCOPE_LABELS[item]}
                </Chip>
            ))}
        </ScrollView>
    );
};

export default SearchScopeChips;
