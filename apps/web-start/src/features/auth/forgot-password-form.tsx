'use client';

import { useCreatePasswordResetRequest } from '@hikka/react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { z } from '@/utils/i18n/zod';
import { Link } from '@/utils/navigation';

const formSchema = z.object({
    email: z.string().email(),
});

const ForgotPasswordForm = () => {
    const mutationRequestPasswordReset = useCreatePasswordResetRequest({
        options: {
            onSuccess: (data) => {
                toast.info(
                    <span>
                        <span className="font-bold">{data.username}</span>, ми
                        успішно надіслали Вам лист для відновлення паролю на
                        вашу поштову адресу.
                    </span>,
                );

                form.reset();
            },
        },
    });

    const form = useAppForm({
        defaultValues: {
            email: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationRequestPasswordReset.mutate(value);
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
                            onChange={(e) =>
                                field.handleChange(e.target.value)
                            }
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                disabled={mutationRequestPasswordReset.isPending}
            >
                {mutationRequestPasswordReset.isPending && (
                    <span className="loading loading-spinner mr-2"></span>
                )}
                Відновити
            </Button>

            {/* Back to Login */}
            <Button
                variant="secondary"
                disabled={mutationRequestPasswordReset.isPending}
                className="w-full"
                asChild
            >
                <Link to="/login">Повернутись до входу</Link>
            </Button>
        </form>
    );
};

export default ForgotPasswordForm;
