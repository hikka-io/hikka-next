import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, View } from 'react-native';

import { API_LIMITS, searchUsersOptions, type UserResponse } from '@hikka/api';
import { getDeclensionWord, SYMBOL_FORMS } from '@hikka/core';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { DEBOUNCE_MS, useDebouncedValue } from '@/services/use-debounced-value';

const MIN = API_LIMITS.userSearchQuery.min;
const TOO_SHORT = `Введіть щонайменше ${MIN} ${getDeclensionWord(MIN, SYMBOL_FORMS)}`;
const MAX_RESULTS = 5;

type Props = {
    query: string;
    onPick: (user: UserResponse & { username: string }) => void;
};

/** The web's `@` user search: suggestions for the name typed before the caret. */
const MentionPicker: FC<Props> = ({ query, onPick }) => {
    const search = useDebouncedValue(query, DEBOUNCE_MS.input);
    const tooShort = search.trim().length < MIN;
    const { data, isFetching, isError } = useQuery({
        ...searchUsersOptions({ body: { query: search } }),
        enabled: !tooShort,
    });

    const users = data
        ?.filter(
            (user): user is UserResponse & { username: string } =>
                !!user.username,
        )
        .slice(0, MAX_RESULTS);

    const message = tooShort
        ? TOO_SHORT
        : isError
          ? 'Не вдалося знайти користувачів'
          : users?.length === 0 && !isFetching && search === query
            ? 'Користувачів не знайдено'
            : null;

    return (
        <View className="max-h-56 border-border border-t">
            {message ? (
                <Text className="px-4 py-3 text-muted-foreground text-sm">
                    {message}
                </Text>
            ) : !users ? (
                <Spinner className="py-3" />
            ) : (
                <ScrollView keyboardShouldPersistTaps="always">
                    {users.map((user) => (
                        <Pressable
                            key={user.reference}
                            accessibilityRole="button"
                            onPress={() => onPick(user)}
                            className="min-h-11 flex-row items-center gap-3 px-4 active:bg-accent"
                        >
                            <Avatar className="size-7">
                                <AvatarImage src={user.avatar} size={28} />
                                <AvatarFallback>
                                    {user.username[0]}
                                </AvatarFallback>
                            </Avatar>
                            <Text numberOfLines={1} className="flex-1 text-sm">
                                {user.username}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default MentionPicker;
