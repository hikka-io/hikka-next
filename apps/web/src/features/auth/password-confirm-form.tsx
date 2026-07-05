import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    authInfoQueryKey,
    passwordResetMutation,
    profileQueryKey,
    setAuthToken,
} from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import Spinner from '@/components/ui/spinner';
import { setAuthCookieFn } from '@/utils/auth';
import { z } from '@/utils/i18n/zod';
import { useParams, useRouter } from '@/utils/navigation';

import PasswordInput from './password-input';

const formSchema = z
    .object({
        password: z.string().min(6),
        passwordConfirmation: z.string().min(6),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const PasswordConfirmForm = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const router = useRouter();

    const token = params.token as string;

    const mutationConfirmPasswordReset = useMutation({
        ...passwordResetMutation(),
        onSuccess: async (data) => {
            await setAuthCookieFn({
                data: { secret: data.secret },
            });
            setAuthToken(data.secret);
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: profileQueryKey(),
                }),
                queryClient.invalidateQueries({
                    queryKey: authInfoQueryKey(),
                }),
            ]);
            form.reset();
            router.push('/');
            toast.success('Ви успішно змінили Ваш пароль.');
        },
    });

    const form = useAppForm({
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationConfirmPasswordReset.mutate({
                body: {
                    password: value.password,
                    token,
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

            <Button
                type="submit"
                className="w-full"
                disabled={
                    mutationConfirmPasswordReset.isPending ||
                    mutationConfirmPasswordReset.isSuccess
                }
            >
                {mutationConfirmPasswordReset.isPending && (
                    <Spinner className="mr-2" />
                )}
                Відновити
            </Button>
        </form>
    );
};

export default PasswordConfirmForm;
