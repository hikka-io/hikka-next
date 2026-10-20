import type { FC } from 'react';

import { useForm, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { z } from 'zod';

import { loginMutation } from '@hikka/api';
import { passwordSchema } from '@hikka/core';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { identifierSchema } from '@/utils/form-schemas';

import AuthHeader from './auth-header';
import CaptchaSlot from './captcha-slot';
import { errorMessage } from './error-message';
import FieldChain from './field-chain';
import FormMessage from './form-message';
import FormTextField from './form-text-field';
import { signIn } from './session';
import SubmitButton from './submit-button';
import { useCaptchaGate } from './use-captcha-gate';

const formSchema = z.object({
    identifier: identifierSchema,
    password: passwordSchema,
});

type Props = {
    onSuccess: () => void;
};

const LoginForm: FC<Props> = ({ onSuccess }) => {
    const router = useRouter();
    const gate = useCaptchaGate();

    const login = useMutation({
        ...loginMutation(),
        onSuccess: async ({ secret }) => {
            await signIn(secret);
            onSuccess();
        },
        onError: gate.reset,
    });

    const form = useForm({
        defaultValues: { identifier: '', password: '' },
        validators: { onChange: formSchema },
        onSubmit: ({ value: { identifier, password } }) => {
            const captcha = gate.take();
            if (!captcha) return;

            const body = identifier.includes('@')
                ? { email: identifier, password }
                : { username: identifier, password };

            login.mutate({ body, headers: { captcha } });
        },
    });

    const submitted = useStore(
        form.store,
        (state) => state.submissionAttempts > 0,
    );
    const busy = login.isPending || login.isSuccess;

    return (
        <FieldChain onSubmit={form.handleSubmit}>
            <View className="gap-4 bg-background p-6">
                <AuthHeader title="Вхід">
                    Увійдіть до свого акаунту Hikka
                </AuthHeader>

                <form.Field name="identifier">
                    {(field) => (
                        <FormTextField
                            field={field}
                            submitted={submitted}
                            label="Юзернейм або пошта"
                            placeholder="Введіть ваш юзернейм або пошту"
                            autoCapitalize="none"
                            autoComplete="username"
                            autoCorrect={false}
                            keyboardType="email-address"
                            clearButtonMode="while-editing"
                            textContentType="username"
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
                            placeholder="Введіть ваш пароль"
                            secureTextEntry
                            autoComplete="current-password"
                            textContentType="password"
                            editable={!busy}
                        />
                    )}
                </form.Field>

                <Button
                    variant="link"
                    size="sm"
                    containerClassName="self-end"
                    disabled={busy}
                    onPress={() => router.replace('/reset')}
                >
                    Забули пароль?
                </Button>

                <CaptchaSlot gate={gate} />

                <FormMessage
                    message={
                        login.error ? errorMessage(login.error) : undefined
                    }
                />

                <SubmitButton
                    label="Увійти"
                    busy={busy}
                    disabled={!gate.token}
                    onPress={form.handleSubmit}
                />

                <View className="flex-row flex-wrap items-center justify-center">
                    <Text className="text-muted-foreground text-sm">
                        Не маєте аккаунту?
                    </Text>
                    <Button
                        variant="link"
                        size="sm"
                        disabled={busy}
                        onPress={() => router.replace('/signup')}
                    >
                        Зареєструйтесь зараз
                    </Button>
                </View>
            </View>
        </FieldChain>
    );
};

export default LoginForm;
