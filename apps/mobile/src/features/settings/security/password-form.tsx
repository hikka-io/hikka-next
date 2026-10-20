import type { FC } from 'react';

import { FieldGroup, TextInput } from '@expo/ui';
import { useForm, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { z } from 'zod';

import { changePasswordMutation } from '@hikka/api';
import { apiErrorMessage, matchFields, passwordSchema } from '@hikka/core';

import { CONFIRM_PASSWORD_AUTO_COMPLETE } from '@/features/auth';

import { firstFieldError } from '../first-field-error';
import SettingsActionRow from '../settings-action-row';
import SettingsFooterText from '../settings-footer-text';
import SettingsForm from '../settings-form';

const formSchema = z
    .object({
        password: passwordSchema,
        passwordConfirmation: z.string(),
    })
    .refine(
        ...matchFields(
            'password',
            'passwordConfirmation',
            'Паролі не збігаються',
        ),
    );

const FIELDS = ['password', 'passwordConfirmation'] as const;

const PasswordForm: FC = () => {
    const router = useRouter();

    const change = useMutation({
        ...changePasswordMutation(),
        onSuccess: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toast.success('Ви успішно змінили пароль.');
            router.back();
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            toast.error(apiErrorMessage(error, 'Не вдалося змінити пароль.'));
        },
    });

    const form = useForm({
        defaultValues: { password: '', passwordConfirmation: '' },
        validators: { onChange: formSchema },
        onSubmit: ({ value }) =>
            change.mutate({ body: { password: value.password } }),
    });

    const error = useStore(form.store, (state) =>
        firstFieldError(state, FIELDS),
    );

    return (
        <SettingsForm>
            <FieldGroup.Section title="Новий пароль">
                <form.Field name="password">
                    {(field) => (
                        <TextInput
                            placeholder="Введіть новий пароль"
                            defaultValue={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                            secureTextEntry
                            autoComplete="new-password"
                            editable={!change.isPending}
                        />
                    )}
                </form.Field>
                <form.Field name="passwordConfirmation">
                    {(field) => (
                        <TextInput
                            placeholder="Підтвердіть новий пароль"
                            defaultValue={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                            secureTextEntry
                            autoComplete={CONFIRM_PASSWORD_AUTO_COMPLETE}
                            editable={!change.isPending}
                        />
                    )}
                </form.Field>
                <FieldGroup.SectionFooter>
                    <SettingsFooterText error={!!error}>
                        {error ?? 'Щонайменше 8 символів'}
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

export default PasswordForm;
