import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Plus, X } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { CompanyTypeEnum, searchCompaniesOptions } from '@hikka/api';

import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { DEBOUNCE_MS, useDebouncedValue } from '@/services/use-debounced-value';

import { useFilterNames, useRememberName } from './catalog-search-store';
import FilterSection from './filter-section';

/** The web sends studio lookups from three characters (`STUDIO_SEARCH_MIN_LENGTH`). */
const STUDIO_SEARCH_MIN_LENGTH = 3;
const RESULT_SIZE = 10;

type Props = {
    selected?: string[];
    onToggle: (slug: string) => void;
};

const StudioFilter: FC<Props> = ({ selected = [], onToggle }) => {
    const [text, setText] = useState('');
    const query = useDebouncedValue(text.trim(), DEBOUNCE_MS.input);
    const names = useFilterNames();
    const rememberName = useRememberName();
    const enabled = query.length >= STUDIO_SEARCH_MIN_LENGTH;

    const { data, isFetching } = useQuery({
        ...searchCompaniesOptions({
            body: { type: CompanyTypeEnum.STUDIO, query },
            query: { size: RESULT_SIZE },
        }),
        enabled,
    });

    const results = enabled
        ? (data?.list ?? []).filter((studio) => !selected.includes(studio.slug))
        : [];

    const toggle = (slug: string) => {
        Haptics.selectionAsync();
        onToggle(slug);
    };

    return (
        <FilterSection title="Студія">
            {selected.length > 0 && (
                <View className="flex-row flex-wrap gap-x-2">
                    {selected.map((slug) => (
                        <Chip
                            key={slug}
                            selected
                            accessibilityLabel={`Прибрати студію ${names[slug] ?? slug}`}
                            onPress={() => toggle(slug)}
                        >
                            {names[slug] ?? slug}
                            <Icon as={X} />
                        </Chip>
                    ))}
                </View>
            )}
            <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Назва студії..."
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                className="h-11 rounded-lg border border-border bg-secondary/20 px-3 text-base text-foreground"
                placeholderTextColorClassName="accent-muted-foreground"
            />
            {enabled && isFetching && results.length === 0 ? (
                <Text className="text-muted-foreground text-sm">
                    Завантаження...
                </Text>
            ) : null}
            {enabled && !isFetching && results.length === 0 ? (
                <Text className="text-muted-foreground text-sm">
                    Студій не знайдено
                </Text>
            ) : null}
            {results.length > 0 && (
                <View className="flex-row flex-wrap gap-x-2">
                    {results.map((studio) => (
                        <Chip
                            key={studio.slug}
                            className="bg-secondary"
                            accessibilityLabel={`Додати студію ${studio.name}`}
                            onPress={() => {
                                rememberName(studio.slug, studio.name);
                                toggle(studio.slug);
                            }}
                        >
                            <Icon as={Plus} />
                            {studio.name}
                        </Chip>
                    ))}
                    {isFetching ? <Spinner /> : null}
                </View>
            )}
        </FilterSection>
    );
};

export default StudioFilter;
