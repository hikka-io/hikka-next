import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import type { MainContentTypeEnum } from '@hikka/api';
import { getTitle } from '@hikka/core';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import ListEntryForm from './list-entry-form';
import { LOGIN_HREF } from './list-entry-href';
import { contentInfoOptions } from './list-entry-options';
import { useListEntry } from './use-list-entry';

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
};

const Message: FC<{ text: string; action: string; onPress: () => void }> = ({
    text,
    action,
    onPress,
}) => (
    <View className="items-center gap-3 py-10">
        <Text className="text-center text-muted-foreground text-sm">
            {text}
        </Text>
        <Button variant="secondary" size="md" onPress={onPress}>
            {action}
        </Button>
    </View>
);

/** The edit sheet's content (the web's `ListEntryEditDialog`). Mount it keyed by slug. */
const ListEntrySheet: FC<Props> = ({ contentType, slug }) => {
    const router = useRouter();
    const entryState = useListEntry({ contentType, slug });
    const { data: content } = useQuery(contentInfoOptions(contentType, slug));
    const title = content ? getTitle(content) : '';

    const body = () => {
        switch (entryState.state) {
            case 'signed-out':
                return (
                    <Message
                        text="Увійдіть, щоб додавати тайтли до списків."
                        action="Увійти"
                        onPress={() => router.replace(LOGIN_HREF)}
                    />
                );
            case 'error':
                return (
                    <Message
                        text="Не вдалося завантажити запис зі списку."
                        action="Повторити"
                        onPress={entryState.retry}
                    />
                );
            case 'loading':
                return (
                    <View className="items-center py-10">
                        <ActivityIndicator />
                    </View>
                );
            default:
                return (
                    <ListEntryForm
                        contentType={contentType}
                        slug={slug}
                        title={title}
                        entry={
                            entryState.state === 'tracked'
                                ? entryState.entry
                                : null
                        }
                        content={content}
                        onClose={() => router.back()}
                    />
                );
        }
    };

    return (
        <ScrollView
            className="bg-background"
            contentContainerClassName="gap-4 px-4 pt-6 pb-8"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets
        >
            <Text numberOfLines={2} className="font-bold text-xl leading-7">
                {title || ' '}
            </Text>
            {body()}
        </ScrollView>
    );
};

export default ListEntrySheet;
