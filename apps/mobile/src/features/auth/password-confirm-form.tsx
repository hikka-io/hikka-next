import type { FC } from 'react';

import { useForm, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { View } from 'react-native';
import { toast } from 'sonner-native';
import { z } from 'zod';

import { passwordResetMutation } from '@hikka/api';
import { matchFields, passwordSchema } from '@hikka/core';

import { Text } from '@/components/ui/text';

import AuthHeader from './auth-header';
import { errorMessage } from './error-message';
import FormTextField from './form-text-field';
import { signIn } from './session';
import SubmitButton from './submit-button';

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

type Props = {
    token: string;
    onSuccess: () => void;
};

const PasswordConfirmForm: FC<Props> = ({ token, onSuccess }) => {
    const confirm = useMutation({
        ...passwordResetMutation(),
        onSuccess: async ({ secret }) => {
            await signIn(secret);
            toast.success('Ви успішно змінили Ваш пароль.');
            onSuccess();
        },
    });

    const form = useForm({
        defaultValues: { password: '', passwordConfirmation: '' },
        validators: { onChange: formSchema },
        onSubmit: ({ value }) =>
            confirm.mutate({ body: { password: value.password, token } }),
    });

    const submitted = useStore(
        form.store,
        (state) => state.submissionAttempts > 0,
    );
    const busy = confirm.isPending || confirm.isSuccess;

    return (
        <View className="gap-4 bg-background p-6">
            <AuthHeader title="Новий пароль">
                Будь ласка, введіть новий пароль.
            </AuthHeader>

            <form.Field name="password">
                {(field) => (
                    <FormTextField
                        field={field}
                        submitted={submitted}
                        label="Пароль"
                        placeholder="Введіть пароль"
                        secureTextEntry
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="next"
                        editable={!busy}
                    />
                )}
            </form.Field>

            <form.Field name="passwordConfirmation">
                {(field) => (
                    <FormTextField
                        field={field}
                        submitted={submitted}
                        label="Підтвердження паролю"
                        placeholder="Повторіть пароль"
                        secureTextEntry
                        returnKeyType="go"
                        onSubmitEditing={form.handleSubmit}
                        editable={!busy}
                    />
                )}
            </form.Field>

            {confirm.error ? (
                <Text className="text-destructive-foreground text-sm">
                    {errorMessage(confirm.error)}
                </Text>
            ) : null}

            <SubmitButton
                label="Відновити"
                busy={busy}
                onPress={form.handleSubmit}
            />
        </View>
    );
};

export default PasswordConfirmForm;
