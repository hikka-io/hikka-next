import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { changeEmailMutation } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { invalidateSession } from '@/utils/api/invalidate-content-state';
import { emailSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';

const formSchema = z
    .object({
        email: emailSchema,
        emailConfirmation: z.string(),
    })
    .refine((data) => data.email === data.emailConfirmation, {
        message: 'Адреси не збігаються',
        path: ['emailConfirmation'],
    });

const EmailSettings = () => {
    const queryClient = useQueryClient();

    const mutationChangeEmail = useMutation({
        ...changeEmailMutation(),
        onSuccess: async () => {
            invalidateSession(queryClient);
            toast.success('Ви успішно змінили поштову адресу.');
        },
    });

    const form = useAppForm({
        defaultValues: {
            email: '',
            emailConfirmation: '',
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            mutationChangeEmail.mutate({
                body: { email: value.email },
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
            className="flex flex-col items-start gap-6"
        >
            <form.AppField
                name="email"
                children={(field) => (
                    <field.TextField
                        type="email"
                        label="Новий email"
                        placeholder="Введіть новий email"
                        autoComplete="email"
                        className="w-full"
                    />
                )}
            />
            <form.AppField
                name="emailConfirmation"
                children={(field) => (
                    <field.TextField
                        type="email"
                        label="Підтвердити email"
                        placeholder="Підтвердіть новий email"
                        className="w-full"
                    />
                )}
            />
            <SubmitButton
                size="md"
                variant="default"
                loading={mutationChangeEmail.isPending}
            >
                Зберегти
            </SubmitButton>
        </form>
    );
};

export default EmailSettings;
