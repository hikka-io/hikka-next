import type { FC } from 'react';

import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import type { AnimeResponse } from '@hikka/api';

import { getTitle } from '@/utils/title';

type Props = {
    anime: AnimeResponse;
};

const AnimeRow: FC<Props> = ({ anime }) => {
    const year = anime.start_date
        ? String(new Date(anime.start_date * 1000).getFullYear())
        : null;
    const meta = [anime.media_type?.toUpperCase(), year]
        .filter(Boolean)
        .join(' · ');

    return (
        <Link href={`/anime/${anime.slug}`} asChild>
            <Pressable className="flex-row gap-3 px-4 py-2 active:bg-muted">
                <Image
                    source={anime.image}
                    style={{ width: 64, height: 90, borderRadius: 8 }}
                    contentFit="cover"
                    transition={150}
                />
                <View className="flex-1 justify-center gap-1">
                    <Text
                        className="font-semibold text-base text-foreground"
                        numberOfLines={2}
                    >
                        {getTitle(anime)}
                    </Text>
                    {meta ? (
                        <Text className="text-muted-foreground text-sm">
                            {meta}
                        </Text>
                    ) : null}
                    {anime.score > 0 ? (
                        <View className="self-start rounded-md border border-primary-border bg-primary px-1.5 py-0.5">
                            <Text className="font-semibold text-primary-foreground text-xs">
                                {anime.score.toFixed(2)}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </Pressable>
        </Link>
    );
};

export default AnimeRow;
