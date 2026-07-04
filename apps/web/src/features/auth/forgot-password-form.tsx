import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { resetPasswordMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import { z } from '@/utils/i18n/zod';
import { Link } from '@/utils/navigation';

const formSchema = z.object({
    email: z.string().email(),
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
        validators: { onSubmit: formSchema },
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

            <Button
                type="submit"
                className="w-full"
                disabled={mutationRequestPasswordReset.isPending}
            >
                {mutationRequestPasswordReset.isPending && (
                    <Spinner className="mr-2" />
                )}
                Відновити
            </Button>

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
