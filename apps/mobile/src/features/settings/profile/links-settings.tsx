import { type FC, useState } from 'react';

import { FieldGroup, TextInput } from '@expo/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

import {
    API_LIMITS,
    changeLinksMutation,
    type ProfileResponse,
    parseUserLinks,
} from '@hikka/api';
import {
    newId,
    parseUrl,
    userLinkTextSchema,
    userLinkUrlSchema,
} from '@hikka/core';

import { useSession } from '@/features/auth';
import {
    invalidateSession,
    invalidateUserProfile,
} from '@/utils/api/invalidate-content-state';
import { toastApiError } from '@/utils/offline-toast';

import SettingsActionRow from '../settings-action-row';
import SettingsFooterText from '../settings-footer-text';
import SettingsForm from '../settings-form';
import SettingsLoading from '../settings-loading';

type Draft = { id: string; url: string; text: string };

const sameUrl = (value: string) => parseUrl(value.trim())?.href ?? value.trim();

/** The first problem with each draft, by id; a duplicate is reported on the later one, as on the web. */
const validate = (drafts: Draft[]) => {
    const errors = new Map<string, string>();
    const seen = new Set<string>();

    for (const draft of drafts) {
        const url = userLinkUrlSchema.safeParse(draft.url);
        const text = userLinkTextSchema.safeParse(draft.text);
        const message =
            url.error?.issues[0]?.message ?? text.error?.issues[0]?.message;

        if (message) {
            errors.set(draft.id, message);
        } else if (seen.has(sameUrl(draft.url))) {
            errors.set(draft.id, 'Це посилання вже додано');
        }
        seen.add(sameUrl(draft.url));
    }

    return errors;
};

type Props = {
    user: ProfileResponse;
};

const LinksForm: FC<Props> = ({ user }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [drafts, setDrafts] = useState<Draft[]>(() =>
        parseUserLinks(user.links).map((link) => ({
            id: newId(),
            url: link.url,
            text: link.text ?? '',
        })),
    );
    const [submitted, setSubmitted] = useState(false);

    const save = useMutation({
        ...changeLinksMutation(),
        onSuccess: () => {
            invalidateSession(queryClient);
            if (user.username)
                invalidateUserProfile(queryClient, user.username);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toast.success('Ви успішно оновили посилання профілю.');
            router.back();
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            toastApiError(error, 'Не вдалося зберегти посилання.');
        },
    });

    const errors = validate(drafts);

    const edit = (id: string, patch: Partial<Draft>) =>
        setDrafts((prev) =>
            prev.map((draft) =>
                draft.id === id ? { ...draft, ...patch } : draft,
            ),
        );

    const move = (index: number) =>
        setDrafts((prev) => {
            const next = [...prev];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            return next;
        });

    const submit = () => {
        setSubmitted(true);
        if (errors.size > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        save.mutate({
            body: {
                links: drafts.map(({ url, text }) => ({
                    url: url.trim(),
                    text: text.trim() || null,
                })),
            },
        });
    };

    return (
        <SettingsForm>
            {drafts.map((draft, index) => {
                const error = submitted ? errors.get(draft.id) : undefined;

                return (
                    <FieldGroup.Section
                        key={draft.id}
                        title={`Посилання ${index + 1}`}
                    >
                        <TextInput
                            placeholder="https://"
                            defaultValue={draft.url}
                            onChangeText={(url) => edit(draft.id, { url })}
                            keyboardType="url"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="url"
                            editable={!save.isPending}
                        />
                        <TextInput
                            placeholder="Підпис (необовʼязково)"
                            defaultValue={draft.text}
                            onChangeText={(text) => edit(draft.id, { text })}
                            maxLength={API_LIMITS.userLinkText.max}
                            editable={!save.isPending}
                        />
                        {index > 0 ? (
                            <SettingsActionRow
                                title="Перемістити вгору"
                                disabled={save.isPending}
                                onPress={() => move(index)}
                            />
                        ) : null}
                        <SettingsActionRow
                            title="Видалити"
                            destructive
                            disabled={save.isPending}
                            onPress={() =>
                                setDrafts((prev) =>
                                    prev.filter((item) => item.id !== draft.id),
                                )
                            }
                        />
                        {error ? (
                            <FieldGroup.SectionFooter>
                                <SettingsFooterText error>
                                    {error}
                                </SettingsFooterText>
                            </FieldGroup.SectionFooter>
                        ) : null}
                    </FieldGroup.Section>
                );
            })}
            <FieldGroup.Section>
                <SettingsActionRow
                    title="Додати посилання"
                    disabled={
                        drafts.length >= API_LIMITS.userLinks.max ||
                        save.isPending
                    }
                    onPress={() =>
                        setDrafts((prev) => [
                            ...prev,
                            { id: newId(), url: '', text: '' },
                        ])
                    }
                />
                <FieldGroup.SectionFooter>
                    <SettingsFooterText>
                        {`${drafts.length === 0 ? 'Додайте посилання на свої профілі в інших сервісах. ' : ''}${drafts.length} / ${API_LIMITS.userLinks.max}`}
                    </SettingsFooterText>
                </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section>
                <SettingsActionRow
                    title={save.isPending ? 'Збереження...' : 'Зберегти'}
                    disabled={save.isPending}
                    onPress={submit}
                />
            </FieldGroup.Section>
        </SettingsForm>
    );
};

const LinksSettings: FC = () => {
    const { user, isPending, error, refetch } = useSession();

    if (!user) {
        return (
            <SettingsLoading
                isPending={isPending}
                error={error}
                onRetry={() => void refetch()}
            />
        );
    }

    return <LinksForm user={user} />;
};

export default LinksSettings;
