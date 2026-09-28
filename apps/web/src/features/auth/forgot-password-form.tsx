import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { resetPasswordMutation } from '@hikka/api';

import SubmitButton from '@/components/form/submit-button';
import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { emailSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';
import { Link } from '@/utils/navigation';

const formSchema = z.object({
    email: emailSchema,
});

const ForgotPasswordForm = () => {
    const mutationRequestPasswordReset = useMutation({
        ...resetPasswordMutation(),
        onSuccess: (data) => {
            toast.info(
                <span>
                    <span className="font-bold">{data.username}</span>, ми
                    успішно надіслали Вам лист для відновлення паролю на вашу
                    поштову адресу.
                </span>,
            );

            form.reset();
        },
    });

    const form = useAppForm({
        defaultValues: {
            email: '',
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            mutationRequestPasswordReset.mutate({ body: value });
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
            <form.AppField
                name="email"
                children={(field) => (
                    <field.TextField
                        type="email"
                        label="Email"
                        placeholder="Введіть ваш email"
                        autoComplete="email"
                    />
                )}
            />

            <SubmitButton
                className="w-full"
                loading={mutationRequestPasswordReset.isPending}
            >
                Відновити
            </SubmitButton>

            <Button
                variant="secondary"
                disabled={mutationRequestPasswordReset.isPending}
                className="w-full"
                render={<Link to="/login" />}
            >
                Повернутись до входу
            </Button>
        </form>
    );
};

export default ForgotPasswordForm;
