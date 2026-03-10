'use client';

import { useCreatePasswordResetRequest } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    email: z.string().email(),
});

const ForgotPasswordForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

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

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutationRequestPasswordReset.mutate(data);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Введіть ваш email"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
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
                    <Link href="/login">Повернутись до входу</Link>
                </Button>
            </form>
        </Form>
    );
};

export default ForgotPasswordForm;
