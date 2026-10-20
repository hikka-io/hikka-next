import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { animeSlugOptions } from '@hikka/api';
import { getTitle } from '@hikka/core';

export default function AnimeDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { data: anime, error } = useQuery(
        animeSlugOptions({ path: { slug } }),
    );

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-background p-6">
                <Text className="text-destructive-foreground">
                    {error.message}
                </Text>
            </View>
        );
    }

    if (!anime) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator />
            </View>
        );
    }

    const title = getTitle(anime);
    const synopsis = anime.synopsis_ua ?? anime.synopsis_en;
    const stats = [
        {
            label: 'Оцінка',
            value: anime.score > 0 ? anime.score.toFixed(2) : '—',
        },
        {
            label: 'Епізоди',
            value: `${anime.episodes_released ?? '?'} / ${anime.episodes_total ?? '?'}`,
        },
        { label: 'Тип', value: anime.media_type?.toUpperCase() ?? '—' },
    ];

    return (
        <>
            <Stack.Title>{title}</Stack.Title>
            <ScrollView
                className="flex-1 bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="gap-5 p-4"
            >
                <View className="flex-row gap-4">
                    <Image
                        source={anime.image}
                        style={{ width: 120, height: 170, borderRadius: 12 }}
                        contentFit="cover"
                    />
                    <View className="flex-1 justify-end gap-1">
                        <Text
                            className="font-bold text-foreground text-xl"
                            selectable
                        >
                            {title}
                        </Text>
                        {anime.title_ja ? (
                            <Text
                                className="text-muted-foreground text-sm"
                                selectable
                            >
                                {anime.title_ja}
                            </Text>
                        ) : null}
                    </View>
                </View>

                <View className="flex-row gap-2">
                    {stats.map((stat) => (
                        <View
                            key={stat.label}
                            className="flex-1 gap-0.5 rounded-xl border border-border bg-card p-3"
                        >
                            <Text className="text-muted-foreground text-xs">
                                {stat.label}
                            </Text>
                            <Text className="font-semibold text-base text-card-foreground">
                                {stat.value}
                            </Text>
                        </View>
                    ))}
                </View>

                {anime.genres.length > 0 ? (
                    <View className="flex-row flex-wrap gap-2">
                        {anime.genres.map((genre) => (
                            <View
                                key={genre.slug}
                                className="rounded-full bg-secondary px-3 py-1"
                            >
                                <Text className="text-secondary-foreground text-sm">
                                    {genre.name_ua ?? genre.name_en}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {synopsis ? (
                    <Text
                        className="text-base text-foreground leading-6"
                        selectable
                    >
                        {synopsis}
                    </Text>
                ) : null}
            </ScrollView>
        </>
    );
}
