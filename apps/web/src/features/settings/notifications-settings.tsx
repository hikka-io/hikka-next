import { useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    changeIgnoredNotificationsMutation,
    getIgnoredNotificationsOptions,
} from '@hikka/api';
import {
    ignoredNotifications,
    NOTIFICATION_GROUPS,
    notificationSwitches,
} from '@hikka/core';

import { SubmitButton, useAppForm } from '@/components/form';
import { Header, HeaderTitle } from '@/components/ui/header';
import { writeIgnoredNotifications } from '@/utils/api/invalidate-content-state';

const NotificationsSettings = () => {
    const queryClient = useQueryClient();
    const { data } = useQuery(getIgnoredNotificationsOptions());

    const formValues = useMemo(
        () => notificationSwitches(data?.ignored_notifications),
        [data?.ignored_notifications],
    );

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
                    ignored_notifications: ignoredNotifications(value),
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
                            <HeaderTitle as="h3" size="subsection">
                                {title}
                            </HeaderTitle>
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
