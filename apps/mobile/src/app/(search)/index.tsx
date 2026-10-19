import { useDeferredValue, useState } from 'react';

import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { API_LIMITS } from '@hikka/api';

import AnimeList from '@/components/anime-list';

export default function SearchScreen() {
    const [text, setText] = useState('');
    const query = useDeferredValue(text.trim());

    return (
        <>
            <Stack.Title large>Пошук</Stack.Title>
            <Stack.SearchBar
                placeholder="Назва аніме"
                onChangeText={(event) => setText(event.nativeEvent.text)}
            />
            {query.length >= API_LIMITS.searchQuery.min ? (
                <AnimeList args={{ query }} />
            ) : (
                <View className="flex-1 items-center justify-center bg-background p-6">
                    <Text className="text-muted-foreground">
                        Введіть щонайменше {API_LIMITS.searchQuery.min} символи
                    </Text>
                </View>
            )}
        </>
    );
}
