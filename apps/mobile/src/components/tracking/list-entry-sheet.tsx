import { type FC, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { HikkaApiError, type MainContentTypeEnum } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { isDeadTokenError, signOut } from '@/features/auth';
import { useTitle } from '@/services/session';

import ListEntryForm from './list-entry-form';
import { LOGIN_HREF } from './list-entry-href';
import { contentInfoOptions } from './list-entry-options';
import { useListEntry } from './use-list-entry';
import { useSavePending } from './use-tracking-mutations';

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
    const getTitle = useTitle();
    const router = useRouter();
    const entryState = useListEntry({ contentType, slug });
    const contentQuery = useQuery(contentInfoOptions(contentType, slug));
    const { data: content } = contentQuery;
    const pending = useSavePending(slug);
    const title = content ? getTitle(content) : '';

    // The draft is built once, so it waits for a write in flight (from the header button or a
    // poster overlay) to land: a draft from the pre-write entry would overwrite that write.
    const [draftReady, setDraftReady] = useState(false);
    const canBuildDraft =
        !pending &&
        contentQuery.isSuccess &&
        (entryState.state === 'tracked' || entryState.state === 'untracked');
    if (canBuildDraft && !draftReady) setDraftReady(true);

    useEffect(() => {
        if (isDeadTokenError(contentQuery.error)) void signOut();
    }, [contentQuery.error]);

    const body = () => {
        if (entryState.state === 'signed-out') {
            return (
                <Message
                    text="Увійдіть, щоб додавати тайтли до списків."
                    action="Увійти"
                    onPress={() => router.replace(LOGIN_HREF)}
                />
            );
        }
        if (draftReady && content) {
            return (
                <ListEntryForm
                    contentType={contentType}
                    slug={slug}
                    title={title}
                    entry={
                        entryState.state === 'tracked' ? entryState.entry : null
                    }
                    content={content}
                    onClose={() => router.back()}
                />
            );
        }
        if (
            contentQuery.error instanceof HikkaApiError &&
            contentQuery.error.status === 404
        ) {
            return (
                <Message
                    text="Тайтл не знайдено."
                    action="Закрити"
                    onPress={() => router.back()}
                />
            );
        }
        if (contentQuery.isError) {
            return (
                <Message
                    text="Не вдалося завантажити тайтл."
                    action="Повторити"
                    onPress={() => void contentQuery.refetch()}
                />
            );
        }
        if (entryState.state === 'error') {
            return (
                <Message
                    text="Не вдалося завантажити запис зі списку."
                    action="Повторити"
                    onPress={entryState.retry}
                />
            );
        }
        return (
            <View className="items-center py-10">
                <Spinner />
            </View>
        );
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
