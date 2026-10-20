import type { FC } from 'react';

import { useForm, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';
import { z } from 'zod';

import { signupMutation } from '@hikka/api';
import {
    emailSchema,
    matchFields,
    passwordSchema,
    USERNAME_HINT,
    usernameSchema,
} from '@hikka/core';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import AuthHeader from './auth-header';
import CaptchaSlot from './captcha-slot';
import { CONFIRM_PASSWORD_AUTO_COMPLETE } from './constants';
import { errorMessage } from './error-message';
import FieldChain from './field-chain';
import FormMessage from './form-message';
import FormTextField from './form-text-field';
import { signIn } from './session';
import SubmitButton from './submit-button';
import { useCaptchaGate } from './use-captcha-gate';

const formSchema = z
    .object({
        username: usernameSchema,
        email: emailSchema,
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
    onSuccess: () => void;
};

const SignupForm: FC<Props> = ({ onSuccess }) => {
    const router = useRouter();
    const gate = useCaptchaGate();

    const signup = useMutation({
        ...signupMutation(),
        onSuccess: async ({ secret }, { body }) => {
            await signIn(secret);
            toast.success(`${body.username}, Ви успішно зареєструвались.`);
            onSuccess();
        },
        onError: gate.reset,
    });

    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validators: { onChange: formSchema },
        onSubmit: ({ value: { username, email, password } }) => {
            const captcha = gate.take();
            if (!captcha) return;

            signup.mutate({
                body: { username, email, password },
                headers: { captcha },
            });
        },
    });

    const submitted = useStore(
        form.store,
        (state) => state.submissionAttempts > 0,
    );
    const busy = signup.isPending || signup.isSuccess;

    return (
        <FieldChain onSubmit={form.handleSubmit}>
            <ScrollView
                className="flex-1 bg-background"
                contentContainerClassName="gap-4 p-6"
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets
            >
                <AuthHeader title="Раді познайомитись!">
                    Створіть акаунт Hikka
                </AuthHeader>

                <form.Field name="username">
                    {(field) => (
                        <FormTextField
                            field={field}
                            submitted={submitted}
                            label="Ім'я користувача (нікнейм)"
                            description={USERNAME_HINT}
                            placeholder="Введіть нікнейм"
                            autoCapitalize="none"
                            autoComplete="username-new"
                            autoCorrect={false}
                            spellCheck={false}
                            clearButtonMode="while-editing"
                            textContentType="username"
                            editable={!busy}
                        />
                    )}
                </form.Field>

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
                            editable={!busy}
                        />
                    )}
                </form.Field>

                <form.Field name="password">
                    {(field) => (
                        <FormTextField
                            field={field}
                            submitted={submitted}
                            label="Пароль"
                            placeholder="Введіть пароль"
                            revealable
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="new-password"
                            textContentType="newPassword"
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
                            revealable
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete={CONFIRM_PASSWORD_AUTO_COMPLETE}
                            editable={!busy}
                        />
                    )}
                </form.Field>

                <CaptchaSlot gate={gate} />

                <FormMessage
                    message={
                        signup.error ? errorMessage(signup.error) : undefined
                    }
                />

                <SubmitButton
                    label="Зареєструватись"
                    busy={busy}
                    disabled={!gate.token}
                    onPress={form.handleSubmit}
                />

                <View className="flex-row flex-wrap items-center justify-center">
                    <Text className="text-muted-foreground text-sm">
                        Вже маєте аккаунт?
                    </Text>
                    <Button
                        variant="link"
                        size="sm"
                        disabled={busy}
                        onPress={() => router.replace('/login')}
                    >
                        Увійдіть зараз
                    </Button>
                </View>
            </ScrollView>
        </FieldChain>
    );
};

export default SignupForm;
