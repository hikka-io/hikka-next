'use client';

import { NotificationTypeEnum } from '@hikka/client';
import {
    useIgnoredNotifications,
    useUpdateIgnoredNotifications,
} from '@hikka/react';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    comment_reply: z.boolean().default(true),
    comment_vote: z.boolean().default(true),
    comment_tag: z.boolean().default(true),
    collection_comment: z.boolean().default(true),
    article_comment: z.boolean().default(true),
    collection_vote: z.boolean().default(true),
    article_vote: z.boolean().default(true),
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
    const { data } = useIgnoredNotifications();

    const formValues = useMemo(() => {
        const defaults = formSchema.parse({});

        if (!data?.ignored_notifications) return defaults;

        return data.ignored_notifications.reduce(
            (acc, key) => {
                acc[key as keyof z.infer<typeof formSchema>] = false;
                return acc;
            },
            { ...defaults },
        );
    }, [data?.ignored_notifications]);

    const { mutate: changeIgnoredNotifications, isPending } =
        useUpdateIgnoredNotifications({
            options: {
                onSuccess: async () => {
                    toast.success('Ви успішно змінили налаштування сповіщень.');
                },
            },
        });

    const form = useAppForm({
        defaultValues: formValues,
        validators: { onSubmit: formSchema as never },
        onSubmit: async ({ value }) => {
            changeIgnoredNotifications({
                ignored_notifications: Object.keys(value).filter(
                    (key) =>
                        !value[key as keyof z.infer<typeof formSchema>],
                ) as NotificationTypeEnum[],
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
            className="flex flex-col items-start gap-8"
        >
            <div className="flex w-full flex-col gap-6">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Коментарі</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <form.AppField
                    name="comment_reply"
                    children={(field) => (
                        <field.SwitchField
                            label="Відповідь на коментар"
                            description="Ви отримаєте сповіщення, коли на ваш коментар відповіли"
                            className="w-full"
                        />
                    )}
                />
                <form.AppField
                    name="comment_tag"
                    children={(field) => (
                        <field.SwitchField
                            label="Згадка в коментарі"
                            description="Ви отримаєте сповіщення, коли вас згадали(@) в коментарі"
                            className="w-full"
                        />
                    )}
                />
                <form.AppField
                    name="collection_comment"
                    children={(field) => (
                        <field.SwitchField
                            label="Коментар у колекції"
                            description="Ви отримаєте сповіщення, коли у вашій колекції залишили коментар"
                            className="w-full"
                        />
                    )}
                />
                <form.AppField
                    name="article_comment"
                    children={(field) => (
                        <field.SwitchField
                            label="Коментар у статті"
                            description="Ви отримаєте сповіщення, коли у вашій статті залишили коментар"
                            className="w-full"
                        />
                    )}
                />
                <form.AppField
                    name="edit_comment"
                    children={(field) => (
                        <field.SwitchField
                            label="Коментар у правці"
                            description="Ви отримаєте сповіщення, коли вам залишать коментар у правці"
                            className="w-full"
                        />
                    )}
                />
            </div>
            <div className="flex w-full flex-col gap-6">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Оцінки</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <form.AppField
                    name="comment_vote"
                    children={(field) => (
                        <field.SwitchField
                            label="Оцінка коментаря"
                            description="Ви отримаєте сповіщення, коли ваш коментар оцінили"
                            className="w-full"
                        />
                    )}
                />
                <form.AppField
                    name="collection_vote"
                    children={(field) => (
                        <field.SwitchField
                            label="Оцінка колекції"
                            description="Ви отримаєте сповіщення, коли вашу колекцію оцінили"
                            className="w-full"
                        />
                    )}
                />
                <form.AppField
                    name="article_vote"
                    children={(field) => (
                        <field.SwitchField
                            label="Оцінка статті"
                            description="Ви отримаєте сповіщення, коли вашу статтю оцінили"
                            className="w-full"
                        />
                    )}
                />
            </div>
            <div className="flex w-full flex-col gap-6">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Правки</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <form.AppField
                    name="edit_accepted"
                    children={(field) => (
                        <field.SwitchField
                            label="Прийнята правка"
                            description="Ви отримаєте сповіщення, коли ваша правка прийнята"
                            className="w-full"
                        />
                    )}
                />
                <form.AppField
                    name="edit_denied"
                    children={(field) => (
                        <field.SwitchField
                            label="Відхилена правка"
                            description="Ви отримаєте сповіщення, коли ваша правка відхилена"
                            className="w-full"
                        />
                    )}
                />
            </div>
            <div className="flex w-full flex-col gap-6">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Аніме</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <form.AppField
                    name="schedule_anime"
                    children={(field) => (
                        <field.SwitchField
                            label="Оновлення аніме"
                            description="Ви отримаєте сповіщення про вихід нових епізодів аніме"
                            className="w-full"
                        />
                    )}
                />
            </div>
            <div className="flex w-full flex-col gap-6">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Користувачі</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <form.AppField
                    name="follow"
                    children={(field) => (
                        <field.SwitchField
                            label="Підписка на користувача"
                            description="Ви отримаєте сповіщення, коли хтось підписався на Вас"
                            className="w-full"
                        />
                    )}
                />
            </div>
            <div className="flex w-full flex-col gap-6">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Інше</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <form.AppField
                    name="hikka_update"
                    children={(field) => (
                        <field.SwitchField
                            label="Системні сповіщення"
                            description="Ви отримаєте сповіщення про системні зміни"
                            className="w-full"
                        />
                    )}
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
    );
};

export default Component;
