import { Turnstile } from '@marsidev/react-turnstile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signupMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import { z } from '@/utils/i18n/zod';
import { useRouter } from '@/utils/navigation';

import { handleAuthSuccess } from './handle-auth-success';
import { CAPTCHA_SITE_KEY, useCaptcha } from './hooks/use-captcha';
import OAuthLogin from './oauth-login';
import PasswordInput from './password-input';

const formSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        username: z.string().min(3),
        passwordConfirmation: z.string().min(8),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const SignupForm = () => {
    const queryClient = useQueryClient();
    const { captchaRef, getToken, reset } = useCaptcha();
    const router = useRouter();

    const mutationSignup = useMutation({
        ...signupMutation(),
        onSuccess: async (data) => {
            await handleAuthSuccess(data.secret, queryClient);

            toast.success(
                <span>
                    <span className="font-bold">
                        {form.getFieldValue('username')}
                    </span>
                    , Ви успішно зареєструвались.
                </span>,
            );

            form.reset();
            router.push('/');
        },
        onError: () => {
            reset();
        },
    });

    const form = useAppForm({
        defaultValues: {
            email: '',
            password: '',
            username: '',
            passwordConfirmation: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationSignup.mutate({
                body: {
                    email: value.email,
                    password: value.password,
                    username: value.username,
                },
                headers: {
                    captcha: getToken(),
                },
            });
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4"
        >
            <form.Field
                name="username"
                children={(field) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>
                            Ім&apos;я користувача (нікнейм)
                        </FieldLabel>
                        <Input
                            id={field.name}
                            type="text"
                            placeholder="Введіть Ваше ім'я"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            <form.Field
                name="email"
                children={(field) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                            id={field.name}
                            type="email"
                            placeholder="Введіть ваш email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            <form.Field
                name="password"
                children={(field) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>Пароль</FieldLabel>
                        <PasswordInput
                            id={field.name}
                            placeholder="Введіть пароль"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            <form.Field
                name="passwordConfirmation"
                children={(field) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>
                            Підтвердження паролю
                        </FieldLabel>
                        <PasswordInput
                            id={field.name}
                            placeholder="Повторіть пароль"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            <Turnstile ref={captchaRef} siteKey={CAPTCHA_SITE_KEY} />

            <Button
                type="submit"
                className="w-full"
                disabled={mutationSignup.isPending || mutationSignup.isSuccess}
            >
                {mutationSignup.isPending && <Spinner className="mr-2" />}
                Зареєструватись
            </Button>

            <OAuthLogin
                disabled={mutationSignup.isPending || mutationSignup.isSuccess}
                buttonText="Зареєструватись з Google"
            />
        </form>
    );
};

export default SignupForm;
