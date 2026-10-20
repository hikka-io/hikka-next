import type { FC } from 'react';

import { FieldGroup, TextInput } from '@expo/ui';
import { useForm, useStore } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { z } from 'zod';

import { changeUsernameMutation } from '@hikka/api';
import { USERNAME_HINT, usernameSchema } from '@hikka/core';

import { useSession } from '@/features/auth';
import {
    invalidateSession,
    invalidateUserProfile,
} from '@/utils/api/invalidate-content-state';
import { toastApiError } from '@/utils/offline-toast';

import { firstFieldError } from '../first-field-error';
import SettingsActionRow from '../settings-action-row';
import SettingsFooterText from '../settings-footer-text';
import SettingsForm from '../settings-form';

const formSchema = z.object({ username: usernameSchema });

const FIELDS = ['username'] as const;

const UsernameForm: FC = () => {
    const router = useRouter();
    const { user } = useSession();
    const queryClient = useQueryClient();

    const change = useMutation({
        ...changeUsernameMutation(),
        onSuccess: () => {
            invalidateSession(queryClient);
            if (user?.username)
                invalidateUserProfile(queryClient, user.username);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toast.success("Ви успішно змінили ім'я користувача.");
            router.back();
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            toastApiError(error, "Не вдалося змінити ім'я користувача.");
        },
    });

    const form = useForm({
        defaultValues: { username: '' },
        validators: { onChange: formSchema },
        onSubmit: ({ value }) =>
            change.mutate({ body: { username: value.username } }),
    });

    const error = useStore(form.store, (state) =>
        firstFieldError(state, FIELDS),
    );

    return (
        <SettingsForm>
            <FieldGroup.Section title="Нове ім'я користувача">
                <form.Field name="username">
                    {(field) => (
                        <TextInput
                            placeholder="Введіть новий нікнейм"
                            defaultValue={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="off"
                            returnKeyType="done"
                            onSubmitEditing={() => form.handleSubmit()}
                            editable={!change.isPending}
                        />
                    )}
                </form.Field>
                <FieldGroup.SectionFooter>
                    <SettingsFooterText error={!!error}>
                        {error ?? USERNAME_HINT}
                    </SettingsFooterText>
                </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section>
                <SettingsActionRow
                    title={change.isPending ? 'Збереження…' : 'Зберегти'}
                    disabled={change.isPending}
                    onPress={() => form.handleSubmit()}
                />
            </FieldGroup.Section>
        </SettingsForm>
    );
};

export default UsernameForm;
