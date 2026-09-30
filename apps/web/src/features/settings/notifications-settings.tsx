import { useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    changeIgnoredNotificationsMutation,
    getIgnoredNotificationsOptions,
    NotificationTypeEnum,
} from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { writeIgnoredNotifications } from '@/utils/api/invalidate-content-state';

const GROUPS = [
    { id: 'comments', title: 'Коментарі' },
    { id: 'votes', title: 'Оцінки' },
    { id: 'edits', title: 'Правки' },
    { id: 'anime', title: 'Аніме' },
    { id: 'users', title: 'Користувачі' },
    { id: 'other', title: 'Інше' },
] as const;

type Setting = {
    group: (typeof GROUPS)[number]['id'];
    label: string;
    description: string;
};

const NOTIFICATION_SETTINGS = {
    comment_reply: {
        group: 'comments',
        label: 'Відповідь на коментар',
        description: 'Ви отримаєте сповіщення, коли на ваш коментар відповіли',
    },
    comment_vote: {
        group: 'votes',
        label: 'Оцінка коментаря',
        description: 'Ви отримаєте сповіщення, коли ваш коментар оцінили',
    },
    comment_tag: {
        group: 'comments',
        label: 'Згадка в коментарі',
        description: 'Ви отримаєте сповіщення, коли вас згадали(@) в коментарі',
    },
    collection_comment: {
        group: 'comments',
        label: 'Коментар у колекції',
        description:
            'Ви отримаєте сповіщення, коли у вашій колекції залишили коментар',
    },
    article_comment: {
        group: 'comments',
        label: 'Коментар у статті',
        description:
            'Ви отримаєте сповіщення, коли у вашій статті залишили коментар',
    },
    collection_vote: {
        group: 'votes',
        label: 'Оцінка колекції',
        description: 'Ви отримаєте сповіщення, коли вашу колекцію оцінили',
    },
    article_vote: {
        group: 'votes',
        label: 'Оцінка статті',
        description: 'Ви отримаєте сповіщення, коли вашу статтю оцінили',
    },
    edit_comment: {
        group: 'comments',
        label: 'Коментар у правці',
        description:
            'Ви отримаєте сповіщення, коли вам залишать коментар у правці',
    },
    edit_accepted: {
        group: 'edits',
        label: 'Прийнята правка',
        description: 'Ви отримаєте сповіщення, коли ваша правка прийнята',
    },
    edit_denied: {
        group: 'edits',
        label: 'Відхилена правка',
        description: 'Ви отримаєте сповіщення, коли ваша правка відхилена',
    },
    edit_updated: null,
    hikka_update: {
        group: 'other',
        label: 'Системні сповіщення',
        description: 'Ви отримаєте сповіщення про системні зміни',
    },
    schedule_anime: {
        group: 'anime',
        label: 'Оновлення аніме',
        description: 'Ви отримаєте сповіщення про вихід нових епізодів аніме',
    },
    follow: {
        group: 'users',
        label: 'Підписка на користувача',
        description: 'Ви отримаєте сповіщення, коли хтось підписався на Вас',
    },
    thirdparty_login: null,
} satisfies Record<NotificationTypeEnum, Setting | null>;

const NOTIFICATION_TYPES = Object.values(NotificationTypeEnum);

const NOTIFICATION_GROUPS = GROUPS.map(({ id, title }) => ({
    id,
    title,
    items: NOTIFICATION_TYPES.flatMap((type) => {
        const setting = NOTIFICATION_SETTINGS[type];

        return setting?.group === id ? [{ type, ...setting }] : [];
    }),
}));

const NotificationsSettings = () => {
    const queryClient = useQueryClient();
    const { data } = useQuery(getIgnoredNotificationsOptions());

    const formValues = useMemo(() => {
        const values: Record<string, boolean> = {};

        for (const type of NOTIFICATION_TYPES) values[type] = true;
        for (const type of data?.ignored_notifications ?? []) {
            values[type] = false;
        }

        return values;
    }, [data?.ignored_notifications]);

    const { mutate: changeIgnoredNotifications, isPending } = useMutation({
        ...changeIgnoredNotificationsMutation(),
        onSuccess: (saved) => {
            writeIgnoredNotifications(queryClient, saved);
            toast.success('Ви успішно змінили налаштування сповіщень.');
        },
    });

    const form = useAppForm({
        defaultValues: formValues,
        onSubmit: async ({ value }) => {
            changeIgnoredNotifications({
                body: {
                    ignored_notifications: Object.entries(value)
                        .filter(([, enabled]) => !enabled)
                        .map(([type]) => type),
                },
            });
        },
    });

    return (
        <form.AppForm>
            <form.Form className="flex flex-col items-start gap-8">
                {NOTIFICATION_GROUPS.map(({ id, title, items }) => (
                    <div key={id} className="flex w-full flex-col gap-6">
                        <Header>
                            <HeaderContainer>
                                <HeaderTitle variant="h4">{title}</HeaderTitle>
                            </HeaderContainer>
                        </Header>
                        {items.map(({ type, label, description }) => (
                            <form.AppField
                                key={type}
                                name={type}
                                children={(field) => (
                                    <field.SwitchField
                                        label={label}
                                        description={description}
                                        className="w-full"
                                    />
                                )}
                            />
                        ))}
                    </div>
                ))}
                <SubmitButton size="md" loading={isPending} variant="default">
                    Зберегти
                </SubmitButton>
            </form.Form>
        </form.AppForm>
    );
};

export default NotificationsSettings;
