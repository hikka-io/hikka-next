import { type FC, useState } from 'react';

import { useForm, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { z } from 'zod';

import { loginMutation } from '@hikka/api';

import { emailSchema, passwordSchema } from '@/utils/form-schemas';

import Captcha from './captcha';
import { CAPTCHA_BYPASS } from './captcha-config';
import { signIn } from './session';
import TextField from './text-field';

const formSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

type Props = {
    onSuccess: () => void;
};

const LoginForm: FC<Props> = ({ onSuccess }) => {
    const [captchaToken, setCaptchaToken] = useState(CAPTCHA_BYPASS);
    const [captchaKey, setCaptchaKey] = useState(0);

    const login = useMutation({
        ...loginMutation(),
        onSuccess: async ({ secret }) => {
            await signIn(secret);
            onSuccess();
        },
        onError: () => {
            if (CAPTCHA_BYPASS) return;
            setCaptchaToken(undefined);
            setCaptchaKey((key) => key + 1);
        },
    });

    const form = useForm({
        defaultValues: { email: '', password: '' },
        validators: { onChange: formSchema },
        onSubmit: ({ value }) => {
            if (!captchaToken) return;
            login.mutate({ body: value, headers: { captcha: captchaToken } });
        },
    });

    const submitted = useStore(
        form.store,
        (state) => state.submissionAttempts > 0,
    );
    const busy = login.isPending || login.isSuccess;

    return (
        <View className="gap-4 bg-background p-6">
            <View className="gap-1">
                <Text className="font-bold text-2xl text-foreground">Вхід</Text>
                <Text className="text-muted-foreground text-sm">
                    Увійдіть до свого акаунту Hikka
                </Text>
            </View>

            <form.Field name="email">
                {(field) => (
                    <TextField
                        label="Пошта"
                        placeholder="Введіть вашу пошту"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        error={
                            field.state.meta.isBlurred || submitted
                                ? field.state.meta.errors[0]?.message
                                : undefined
                        }
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        keyboardType="email-address"
                        clearButtonMode="while-editing"
                        textContentType="username"
                        returnKeyType="next"
                        editable={!busy}
                    />
                )}
            </form.Field>

            <form.Field name="password">
                {(field) => (
                    <TextField
                        label="Пароль"
                        placeholder="Введіть ваш пароль"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        error={
                            field.state.meta.isBlurred || submitted
                                ? field.state.meta.errors[0]?.message
                                : undefined
                        }
                        secureTextEntry
                        autoComplete="current-password"
                        textContentType="password"
                        returnKeyType="go"
                        onSubmitEditing={form.handleSubmit}
                        editable={!busy}
                    />
                )}
            </form.Field>

            {CAPTCHA_BYPASS ? null : (
                <View className="items-center">
                    <Captcha key={captchaKey} onToken={setCaptchaToken} />
                </View>
            )}

            {login.error ? (
                <Text className="text-destructive-foreground text-sm">
                    {login.error.message}
                </Text>
            ) : null}

            <Pressable
                className="h-12 items-center justify-center rounded-lg border border-primary-border bg-primary active:opacity-80 disabled:opacity-50"
                disabled={!captchaToken || busy}
                onPress={form.handleSubmit}
            >
                {busy ? (
                    <ActivityIndicator />
                ) : (
                    <Text className="font-semibold text-base text-primary-foreground">
                        Увійти
                    </Text>
                )}
            </Pressable>
        </View>
    );
};

export default LoginForm;
