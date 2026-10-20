import type { FC } from 'react';

import { useForm, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { z } from 'zod';

import { resetPasswordMutation } from '@hikka/api';
import { emailSchema } from '@hikka/core';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import AuthHeader from './auth-header';
import { errorMessage } from './error-message';
import FormTextField from './form-text-field';
import SubmitButton from './submit-button';

const formSchema = z.object({ email: emailSchema });

const ForgotPasswordForm: FC = () => {
    const router = useRouter();

    const reset = useMutation(resetPasswordMutation());

    const form = useForm({
        defaultValues: { email: '' },
        validators: { onChange: formSchema },
        onSubmit: ({ value }) => reset.mutate({ body: value }),
    });

    const submitted = useStore(
        form.store,
        (state) => state.submissionAttempts > 0,
    );

    return (
        <View className="gap-4 bg-background p-6">
            <AuthHeader title="Відновити пароль">
                Будь ласка, введіть дані для отримання листа відновлення.
            </AuthHeader>

            {reset.isSuccess ? (
                <Text className="text-sm">
                    {reset.data.username}, ми успішно надіслали Вам лист для
                    відновлення паролю на вашу поштову адресу.
                </Text>
            ) : (
                <form.Field name="email">
                    {(field) => (
                        <FormTextField
                            field={field}
                            submitted={submitted}
                            label="Email"
                            placeholder="Введіть ваш email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            clearButtonMode="while-editing"
                            textContentType="emailAddress"
                            returnKeyType="go"
                            onSubmitEditing={form.handleSubmit}
                            editable={!reset.isPending}
                        />
                    )}
                </form.Field>
            )}

            {reset.error ? (
                <Text className="text-destructive-foreground text-sm">
                    {errorMessage(reset.error)}
                </Text>
            ) : null}

            {reset.isSuccess ? null : (
                <SubmitButton
                    label="Відновити"
                    busy={reset.isPending}
                    onPress={form.handleSubmit}
                />
            )}

            <Button
                variant="secondary"
                containerClassName="self-stretch"
                className="w-full"
                disabled={reset.isPending}
                onPress={() => router.replace('/login')}
            >
                Повернутись до входу
            </Button>
        </View>
    );
};

export default ForgotPasswordForm;
