import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';

import { GenreTypeEnum } from '@hikka/api';
import { GENRE_TYPES } from '@hikka/core';

import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

import { genreState } from './filter-params';
import FilterSection from './filter-section';
import { useGenres } from './use-genres';

/** Main genres first; adult themes last. */
const GROUP_ORDER: GenreTypeEnum[] = [
    GenreTypeEnum.GENRE,
    GenreTypeEnum.THEME,
    GenreTypeEnum.DEMOGRAPHIC,
    GenreTypeEnum.EXPLICIT,
];

type Props = {
    selected?: string[];
    onCycle: (slug: string) => void;
};

const STATE_LABEL = {
    include: 'включено',
    exclude: 'виключено',
} as const;

/** Tri-state like the web select: tap to include, again to exclude (`-slug`), again to clear. */
const GenreFilter: FC<Props> = ({ selected, onCycle }) => {
    const { data, isPending, error } = useGenres();

    return (
        <FilterSection title="Жанри">
            {isPending ? <Spinner className="self-start" /> : null}
            {error ? (
                <Text className="text-muted-foreground text-sm">
                    Не вдалося завантажити жанри
                </Text>
            ) : null}
            {GROUP_ORDER.map((group) => {
                const genres = data?.list.filter(
                    (genre) => genre.type === group,
                );

                if (!genres?.length) return null;

                return (
                    <View key={group} className="gap-2">
                        <Text className="text-muted-foreground text-xs">
                            {GENRE_TYPES[group].title_ua}
                        </Text>
                        <View className="flex-row flex-wrap gap-x-2">
                            {genres.map((genre) => {
                                const state = genreState(selected, genre.slug);
                                const name = data?.names[genre.slug];

                                return (
                                    <Chip
                                        key={genre.slug}
                                        selected={Boolean(state)}
                                        className={
                                            state === 'include'
                                                ? 'border border-success-border bg-success'
                                                : state === 'exclude'
                                                  ? 'border border-destructive-border bg-destructive'
                                                  : 'bg-secondary'
                                        }
                                        textClassName={
                                            state === 'include'
                                                ? 'text-success-foreground'
                                                : state === 'exclude'
                                                  ? 'text-destructive-foreground'
                                                  : undefined
                                        }
                                        accessibilityLabel={
                                            state
                                                ? `${name}, ${STATE_LABEL[state]}`
                                                : name
                                        }
                                        onPress={() => {
                                            Haptics.selectionAsync();
                                            onCycle(genre.slug);
                                        }}
                                    >
                                        {state === 'include' && (
                                            <Icon as={Plus} />
                                        )}
                                        {state === 'exclude' && (
                                            <Icon as={Minus} />
                                        )}
                                        {name}
                                    </Chip>
                                );
                            })}
                        </View>
                    </View>
                );
            })}
        </FilterSection>
    );
};

export default GenreFilter;
