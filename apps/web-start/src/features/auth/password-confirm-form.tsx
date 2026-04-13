'use client';

import { useConfirmPasswordReset, useHikkaClient } from '@hikka/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { setAuthCookieFn } from '@/utils/auth';
import { z } from '@/utils/i18n/zod';
import { useParams, useRouter } from '@/utils/navigation';

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
    const { client } = useHikkaClient();
    const params = useParams();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const token = params.token as string;

    const mutationConfirmPasswordReset = useConfirmPasswordReset({
        options: {
            onSuccess: async (data) => {
                await setAuthCookieFn({
                    data: { secret: data.secret },
                });
                client.setAuthToken(data.secret);
                form.reset();
                router.push('/');
                toast.success('Ви успішно змінили Ваш пароль.');
            },
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
                password: value.password,
                token,
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
                        <div className="relative">
                            <Input
                                id={field.name}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Введіть пароль"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="absolute top-1/2 right-2 size-8 -translate-y-1/2"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </Button>
                        </div>
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
                        <div className="relative">
                            <Input
                                id={field.name}
                                type={
                                    showPasswordConfirmation
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="Повторіть пароль"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="absolute top-1/2 right-2 size-8 -translate-y-1/2"
                                onClick={() =>
                                    setShowPasswordConfirmation(
                                        !showPasswordConfirmation,
                                    )
                                }
                            >
                                {showPasswordConfirmation ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </Button>
                        </div>
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                disabled={
                    mutationConfirmPasswordReset.isPending ||
                    mutationConfirmPasswordReset.isSuccess
                }
            >
                {mutationConfirmPasswordReset.isPending && (
                    <span className="loading loading-spinner mr-2"></span>
                )}
                Відновити
            </Button>
        </form>
    );
};

export default PasswordConfirmForm;
