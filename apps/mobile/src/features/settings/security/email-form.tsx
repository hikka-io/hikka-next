import type { FC } from 'react';

import { FieldGroup, TextInput } from '@expo/ui';
import { useForm, useStore } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { z } from 'zod';

import { changeEmailMutation } from '@hikka/api';
import { apiErrorMessage, emailSchema, matchFields } from '@hikka/core';

import { invalidateSession } from '@/utils/api/invalidate-content-state';

import { firstFieldError } from '../first-field-error';
import SettingsActionRow from '../settings-action-row';
import SettingsFooterText from '../settings-footer-text';
import SettingsForm from '../settings-form';

const formSchema = z
    .object({
        email: emailSchema,
        emailConfirmation: z.string(),
    })
    .refine(
        ...matchFields('email', 'emailConfirmation', 'Адреси не збігаються'),
    );

const FIELDS = ['email', 'emailConfirmation'] as const;

const EmailForm: FC = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const change = useMutation({
        ...changeEmailMutation(),
        onSuccess: () => {
            invalidateSession(queryClient);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toast.success('Ви успішно змінили поштову адресу.');
            router.back();
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            toast.error(
                apiErrorMessage(error, 'Не вдалося змінити поштову адресу.'),
            );
        },
    });

    const form = useForm({
        defaultValues: { email: '', emailConfirmation: '' },
        validators: { onChange: formSchema },
        onSubmit: ({ value }) =>
            change.mutate({ body: { email: value.email } }),
    });

    const error = useStore(form.store, (state) =>
        firstFieldError(state, FIELDS),
    );

    return (
        <SettingsForm>
            <FieldGroup.Section title="Нова пошта">
                <form.Field name="email">
                    {(field) => (
                        <TextInput
                            placeholder="Введіть новий email"
                            defaultValue={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="email"
                            editable={!change.isPending}
                        />
                    )}
                </form.Field>
                <form.Field name="emailConfirmation">
                    {(field) => (
                        <TextInput
                            placeholder="Підтвердіть новий email"
                            defaultValue={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!change.isPending}
                        />
                    )}
                </form.Field>
                {error ? (
                    <FieldGroup.SectionFooter>
                        <SettingsFooterText error>{error}</SettingsFooterText>
                    </FieldGroup.SectionFooter>
                ) : null}
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

export default EmailForm;
