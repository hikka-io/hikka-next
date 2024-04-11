'use client';

import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Control, useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';

import H5 from '@/components/typography/h5';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import useChangeIgnoredNotifications from '@/services/hooks/settings/useChangeIgnoredNotifications';
import useIgnoredNotifications from '@/services/hooks/settings/useIgnoredNotifications';
import { useModalContext } from '@/services/providers/modal-provider';

type FormValues = {
    comment_reply: boolean;
    comment_vote: boolean;
    comment_tag: boolean;
    collection_comment: boolean;
    collection_vote: boolean;
    edit_comment: boolean;
    edit_accepted: boolean;
    edit_denied: boolean;
    edit_updated: boolean;
    hikka_update: boolean;
    schedule_anime: boolean;
    follow: boolean;
};

interface SwitchFormFieldProps {
    name: keyof FormValues;
    control: Control<FormValues>;
    title: string;
    description?: string;
}

const SwitchFormField = ({
    name,
    control,
    title,
    description,
}: SwitchFormFieldProps) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-2">
                <div>
                    <FormLabel>{title}</FormLabel>
                    {description && (
                        <FormDescription className="text-xs">
                            {description}
                        </FormDescription>
                    )}
                </div>
                <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                </FormControl>
            </FormItem>
        )}
    />
);

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const form = useForm<FormValues>({
        defaultValues: {
            comment_reply: true,
            comment_vote: true,
            comment_tag: true,
            collection_comment: true,
            collection_vote: true,
            edit_comment: true,
            edit_accepted: true,
            edit_denied: true,
            edit_updated: true,
            hikka_update: true,
            schedule_anime: true,
            follow: true,
        },
    });

    const { data } = useIgnoredNotifications();
    const { mutate: changeIgnoredNotifications, isPending } =
        useChangeIgnoredNotifications({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['ignoredNotifications'],
                    exact: false,
                });
                closeModal();
                enqueueSnackbar('Ви успішно змінили налаштування сповіщень.', {
                    variant: 'success',
                });
            },
        });

    const onSubmit = async (data: FormValues) => {
        changeIgnoredNotifications({
            ignored_notifications: Object.keys(data).filter(
                (key) => !data[key as keyof FormValues],
            ) as API.NotificationType[],
        });
    };

    useEffect(() => {
        if (data?.ignored_notifications) {
            form.reset(
                data.ignored_notifications.reduce((acc, key) => {
                    acc[key] = false;
                    return acc;
                }, {} as FormValues),
            );
        }
    }, [data?.ignored_notifications]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 p-6"
            >
                <H5>Коментарі</H5>
                <SwitchFormField
                    name="comment_reply"
                    control={form.control}
                    title="Відповідь на коментар"
                    description="Ви отримаєте сповіщення, коли на ваш коментар відповіли"
                />
                <SwitchFormField
                    name="comment_tag"
                    control={form.control}
                    title="Згадка в коментарі"
                    description="Ви отримаєте сповіщення, коли вас згадали(@) в коментарі"
                />
                <SwitchFormField
                    name="collection_comment"
                    control={form.control}
                    title="Коментар у колекції"
                    description="Ви отримаєте сповіщення, коли у вашій колекції залишили коментар"
                />
                <SwitchFormField
                    name="edit_comment"
                    control={form.control}
                    title="Коментар у правці"
                    description="Ви отримаєте сповіщення, коли вам залишать коментар у правці"
                />
                <H5>Оцінки</H5>
                <SwitchFormField
                    name="comment_vote"
                    control={form.control}
                    title="Оцінка коментаря"
                    description="Ви отримаєте сповіщення, коли ваш коментар оцінили"
                />
                <SwitchFormField
                    name="collection_vote"
                    control={form.control}
                    title="Оцінка колекції"
                    description="Ви отримаєте сповіщення, коли вашу колекцію оцінили"
                />
                <H5>Правки</H5>
                <SwitchFormField
                    name="edit_accepted"
                    control={form.control}
                    title="Прийнята правка"
                    description="Ви отримаєте сповіщення, коли ваша правка прийнята"
                />
                <SwitchFormField
                    name="edit_denied"
                    control={form.control}
                    title="Відхилена правка"
                    description="Ви отримаєте сповіщення, коли ваша правка відхилена"
                />
                <H5>Аніме</H5>
                <SwitchFormField
                    name="schedule_anime"
                    control={form.control}
                    title="Оновлення аніме"
                    description="Ви отримаєте сповіщення про вихід нових епізодів аніме"
                />
                <H5>Користувачі</H5>
                <SwitchFormField
                    name="follow"
                    control={form.control}
                    title="Підписка на користувача"
                    description="Ви отримаєте сповіщення, коли хтось підписався на Вас"
                />
                <H5>Інше</H5>
                <SwitchFormField
                    name="hikka_update"
                    control={form.control}
                    title="Системні сповіщення"
                    description="Ви отримаєте сповіщення про системні зміни"
                />
                <div className="w-full">
                    <Button
                        disabled={isPending}
                        variant="default"
                        type="submit"
                        className="w-full"
                    >
                        {isPending && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Зберегти
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Component;
