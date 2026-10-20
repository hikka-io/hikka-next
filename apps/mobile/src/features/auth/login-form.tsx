import { type FC, useState } from 'react';

import { useForm, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';
import { z } from 'zod';

import { HikkaApiError, loginMutation } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { identifierSchema, passwordSchema } from '@/utils/form-schemas';

import Captcha from './captcha';
import { CAPTCHA_BYPASS } from './captcha-config';
import { FALLBACK_ERROR } from './constants';
import { signIn } from './session';
import TextField from './text-field';

const formSchema = z.object({
    identifier: identifierSchema,
    password: passwordSchema,
});

type Props = {
    onSuccess: () => void;
};

const LoginForm: FC<Props> = ({ onSuccess }) => {
    const [captchaToken, setCaptchaToken] = useState(CAPTCHA_BYPASS);
    const [captchaKey, setCaptchaKey] = useState(0);
    const [captchaWaiting, setCaptchaWaiting] = useState(false);

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
        defaultValues: { identifier: '', password: '' },
        validators: { onChange: formSchema },
        onSubmit: ({ value: { identifier, password } }) => {
            if (!captchaToken) {
                setCaptchaWaiting(true);
                return;
            }

            const body = identifier.includes('@')
                ? { email: identifier, password }
                : { username: identifier, password };

            login.mutate({ body, headers: { captcha: captchaToken } });
        },
    });

    const submitted = useStore(
        form.store,
        (state) => state.submissionAttempts > 0,
    );
    const busy = login.isPending || login.isSuccess;
    const errorMessage =
        login.error instanceof HikkaApiError
            ? login.error.message
            : login.error && FALLBACK_ERROR;

    return (
        <View className="gap-4 bg-background p-6">
            <View className="gap-1">
                <Text className="font-bold text-2xl text-foreground">Вхід</Text>
                <Text className="text-muted-foreground text-sm">
                    Увійдіть до свого акаунту Hikka
                </Text>
            </View>

            <form.Field name="identifier">
                {(field) => (
                    <TextField
                        label="Юзернейм або пошта"
                        placeholder="Введіть ваш юзернейм або пошту"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        error={
                            field.state.meta.isBlurred || submitted
                                ? field.state.meta.errors[0]?.message
                                : undefined
                        }
                        autoCapitalize="none"
                        autoComplete="username"
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
                    <Captcha
                        key={captchaKey}
                        onToken={(token) => {
                            setCaptchaToken(token);
                            if (token) setCaptchaWaiting(false);
                        }}
                    />
                </View>
            )}

            {captchaWaiting && !captchaToken ? (
                <Text className="text-muted-foreground text-sm">
                    Зачекайте, поки завершиться перевірка
                </Text>
            ) : null}

            {errorMessage ? (
                <Text className="text-destructive-foreground text-sm">
                    {errorMessage}
                </Text>
            ) : null}

            <Button
                containerClassName="self-stretch"
                className="w-full"
                disabled={!captchaToken || busy}
                onPress={form.handleSubmit}
            >
                {busy ? (
                    <ActivityIndicator colorClassName="accent-primary-foreground" />
                ) : (
                    'Увійти'
                )}
            </Button>
        </View>
    );
};

export default LoginForm;
