'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import FormSwitch from '@/components/form/form-switch';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Header from '@/components/ui/header';

import useChangeIgnoredNotifications from '@/services/hooks/settings/use-change-ignored-notifications';
import useIgnoredNotifications from '@/services/hooks/settings/use-ignored-notifications';
import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/zod';

const formSchema = z.object({
    comment_reply: z.boolean().default(true),
    comment_vote: z.boolean().default(true),
    comment_tag: z.boolean().default(true),
    collection_comment: z.boolean().default(true),
    collection_vote: z.boolean().default(true),
    edit_comment: z.boolean().default(true),
    edit_accepted: z.boolean().default(true),
    edit_denied: z.boolean().default(true),
    edit_updated: z.boolean().default(true),
    hikka_update: z.boolean().default(true),
    schedule_anime: z.boolean().default(true),
    follow: z.boolean().default(true),
    thirdparty_login: z.boolean().optional().nullable().default(true),
});

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: formSchema.parse({}),
    });

    const { data } = useIgnoredNotifications();
    const { mutate: changeIgnoredNotifications, isPending } =
        useChangeIgnoredNotifications({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['ignored-notifications'],
                    exact: false,
                });
                closeModal();
                enqueueSnackbar('Ви успішно змінили налаштування сповіщень.', {
                    variant: 'success',
                });
            },
        });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        changeIgnoredNotifications({
            ignored_notifications: Object.keys(data).filter(
                (key) => !data[key as keyof z.infer<typeof formSchema>],
            ) as API.NotificationType[],
        });
    };

    useEffect(() => {
        if (data?.ignored_notifications) {
            form.reset(
                data.ignored_notifications.reduce(
                    (acc, key) => {
                        acc[key] = false;
                        return acc;
                    },
                    {} as z.infer<typeof formSchema>,
                ),
            );
        }
    }, [data?.ignored_notifications]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-start gap-8"
            >
                <div className="flex w-full flex-col gap-6">
                    <Header variant="h4" title="Коментарі" />
                    <FormSwitch
                        name="comment_reply"
                        label="Відповідь на коментар"
                        description="Ви отримаєте сповіщення, коли на ваш коментар відповіли"
                        className="w-full"
                    />

                    <FormSwitch
                        name="comment_tag"
                        label="Згадка в коментарі"
                        description="Ви отримаєте сповіщення, коли вас згадали(@) в коментарі"
                        className="w-full"
                    />
                    <FormSwitch
                        name="collection_comment"
                        label="Коментар у колекції"
                        description="Ви отримаєте сповіщення, коли у вашій колекції залишили коментар"
                        className="w-full"
                    />
                    <FormSwitch
                        name="edit_comment"
                        label="Коментар у правці"
                        description="Ви отримаєте сповіщення, коли вам залишать коментар у правці"
                        className="w-full"
                    />
                </div>
                <div className="flex w-full flex-col gap-6">
                    <Header variant="h4" title="Оцінки" />
                    <FormSwitch
                        name="comment_vote"
                        label="Оцінка коментаря"
                        description="Ви отримаєте сповіщення, коли ваш коментар оцінили"
                        className="w-full"
                    />
                    <FormSwitch
                        name="collection_vote"
                        label="Оцінка колекції"
                        description="Ви отримаєте сповіщення, коли вашу колекцію оцінили"
                        className="w-full"
                    />
                </div>
                <div className="flex w-full flex-col gap-6">
                    <Header variant="h4" title="Правки" />
                    <FormSwitch
                        name="edit_accepted"
                        label="Прийнята правка"
                        description="Ви отримаєте сповіщення, коли ваша правка прийнята"
                        className="w-full"
                    />
                    <FormSwitch
                        name="edit_denied"
                        label="Відхилена правка"
                        description="Ви отримаєте сповіщення, коли ваша правка відхилена"
                        className="w-full"
                    />
                </div>
                <div className="flex w-full flex-col gap-6">
                    <Header variant="h4" title="Аніме" />
                    <FormSwitch
                        name="schedule_anime"
                        label="Оновлення аніме"
                        description="Ви отримаєте сповіщення про вихід нових епізодів аніме"
                        className="w-full"
                    />
                </div>
                <div className="flex w-full flex-col gap-6">
                    <Header variant="h4" title="Користувачі" />
                    <FormSwitch
                        name="follow"
                        label="Підписка на користувача"
                        description="Ви отримаєте сповіщення, коли хтось підписався на Вас"
                        className="w-full"
                    />
                </div>
                <div className="flex w-full flex-col gap-6">
                    <Header variant="h4" title="Інше" />
                    <FormSwitch
                        name="hikka_update"
                        label="Системні сповіщення"
                        description="Ви отримаєте сповіщення про системні зміни"
                        className="w-full"
                    />
                </div>
                <Button
                    size="md"
                    disabled={isPending}
                    variant="default"
                    type="submit"
                >
                    {isPending && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </Button>
            </form>
        </Form>
    );
};

export default Component;
