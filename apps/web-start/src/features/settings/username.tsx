'use client';

import { useChangeUsername } from '@hikka/react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';

import { z } from '@/utils/i18n/zod';
import { useRouter } from '@/utils/navigation';

const formSchema = z.object({
    username: z.string().min(2).max(50),
});

const Component = () => {
    const router = useRouter();

    const mutationChangeUsername = useChangeUsername({
        options: {
            onSuccess: async () => {
                router.push('/u/' + form.getFieldValue('username'));
                toast.success('Ви успішно змінили імʼя користвача.');
            },
        },
    });

    const form = useAppForm({
        defaultValues: {
            username: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationChangeUsername.mutate({
                username: value.username,
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
                name="username"
                children={(field) => (
                    <field.TextField
                        type="text"
                        label="Нове ім'я користувача"
                        placeholder="Введіть нове імʼя"
                        className="w-full"
                    />
                )}
            />
            <Button
                size="md"
                disabled={mutationChangeUsername.isPending}
                variant="default"
                type="submit"
            >
                {mutationChangeUsername.isPending && (
                    <span className="loading loading-spinner"></span>
                )}
                Зберегти
            </Button>
        </form>
    );
};

export default Component;
