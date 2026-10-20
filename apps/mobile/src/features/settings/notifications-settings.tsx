import { type FC, useState } from 'react';

import { FieldGroup } from '@expo/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { toast } from 'sonner-native';

import {
    changeIgnoredNotificationsMutation,
    getIgnoredNotificationsOptions,
} from '@hikka/api';
import {
    ignoredNotifications,
    NOTIFICATION_GROUPS,
    notificationSwitches,
} from '@hikka/core';

import { writeIgnoredNotifications } from '@/utils/api/invalidate-content-state';
import { toastApiError } from '@/utils/offline-toast';

import SettingsActionRow from './settings-action-row';
import SettingsFooterText from './settings-footer-text';
import SettingsForm from './settings-form';
import SettingsLoading from './settings-loading';
import SettingsSwitchRow from './settings-switch-row';

type Props = {
    saved: Record<string, boolean>;
};

const NotificationsForm: FC<Props> = ({ saved }) => {
    const queryClient = useQueryClient();
    const [draft, setDraft] = useState(saved);

    const { mutate, isPending } = useMutation({
        ...changeIgnoredNotificationsMutation(),
        onSuccess: (response) => {
            writeIgnoredNotifications(queryClient, response);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toast.success('Ви успішно змінили налаштування сповіщень.');
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            toastApiError(error, 'Не вдалося зберегти налаштування.');
        },
    });

    const changed = Object.keys(saved).some(
        (type) => draft[type] !== saved[type],
    );

    return (
        <SettingsForm>
            {NOTIFICATION_GROUPS.filter((group) => group.items.length > 0).map(
                (group) => (
                    <FieldGroup.Section key={group.id} title={group.title}>
                        {group.items.map((item) => (
                            <SettingsSwitchRow
                                key={item.type}
                                title={item.label}
                                value={draft[item.type] ?? true}
                                disabled={isPending}
                                onValueChange={(enabled) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        [item.type]: enabled,
                                    }))
                                }
                            />
                        ))}
                    </FieldGroup.Section>
                ),
            )}
            <FieldGroup.Section>
                <SettingsActionRow
                    title={isPending ? 'Збереження...' : 'Зберегти'}
                    disabled={!changed || isPending}
                    onPress={() =>
                        mutate({
                            body: {
                                ignored_notifications:
                                    ignoredNotifications(draft),
                            },
                        })
                    }
                />
                <FieldGroup.SectionFooter>
                    <SettingsFooterText>
                        Вимкнені типи не зʼявлятимуться у списку сповіщень.
                    </SettingsFooterText>
                </FieldGroup.SectionFooter>
            </FieldGroup.Section>
        </SettingsForm>
    );
};

const NotificationsSettings: FC = () => {
    const { data, isPending, error, refetch } = useQuery(
        getIgnoredNotificationsOptions(),
    );

    if (!data) {
        return (
            <SettingsLoading
                isPending={isPending}
                error={error}
                onRetry={() => void refetch()}
            />
        );
    }

    return (
        <NotificationsForm
            saved={notificationSwitches(data.ignored_notifications)}
        />
    );
};

export default NotificationsSettings;
