import { type FC, useState } from 'react';

import { FieldGroup, TextInput } from '@expo/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { toast } from 'sonner-native';

import {
    API_LIMITS,
    changeDescriptionMutation,
    type ProfileResponse,
    parseUserLinks,
    UploadTypeEnum,
} from '@hikka/api';

import { useSession } from '@/features/auth';
import { invalidateSession } from '@/utils/api/invalidate-content-state';
import { toastApiError } from '@/utils/offline-toast';

import SettingsActionRow from '../settings-action-row';
import SettingsFooterText from '../settings-footer-text';
import SettingsForm from '../settings-form';
import SettingsLoading from '../settings-loading';
import SettingsNavRow from '../settings-nav-row';
import { useDeleteProfileCover, useProfileImage } from './use-profile-image';

type Props = {
    user: ProfileResponse;
};

const ProfileForm: FC<Props> = ({ user }) => {
    const queryClient = useQueryClient();
    const saved = user.description ?? '';
    const [description, setDescription] = useState(saved);
    const avatar = useProfileImage(UploadTypeEnum.AVATAR);
    const cover = useProfileImage(UploadTypeEnum.COVER);
    const deleteCover = useDeleteProfileCover();

    const save = useMutation({
        ...changeDescriptionMutation(),
        onSuccess: () => {
            invalidateSession(queryClient);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toast.success('Ви успішно змінили загальні налаштування профілю.');
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            toastApiError(error, 'Не вдалося зберегти опис.');
        },
    });

    const trimmed = description.trim();
    const tooLong = trimmed.length > API_LIMITS.profileDescription.max;
    const changed = trimmed !== saved.trim();
    const imageBusy = avatar.busy || cover.busy || deleteCover.isPending;

    return (
        <SettingsForm>
            <FieldGroup.Section title="Зображення профілю">
                <SettingsActionRow
                    title={avatar.busy ? 'Завантаження...' : 'Змінити аватар'}
                    disabled={imageBusy}
                    onPress={avatar.pick}
                />
                <SettingsActionRow
                    title={cover.busy ? 'Завантаження...' : 'Змінити обкладинку'}
                    disabled={imageBusy}
                    onPress={cover.pick}
                />
                {user.cover ? (
                    <SettingsActionRow
                        title="Видалити обкладинку"
                        destructive
                        disabled={imageBusy}
                        onPress={() =>
                            deleteCover.mutate({
                                path: { image_type: UploadTypeEnum.COVER },
                            })
                        }
                    />
                ) : null}
                <FieldGroup.SectionFooter>
                    <SettingsFooterText>
                        Аватар стискається до 400x400, обкладинка до 1500x500.
                    </SettingsFooterText>
                </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title="Опис">
                <TextInput
                    placeholder="Введіть опис"
                    defaultValue={saved}
                    onChangeText={setDescription}
                    multiline
                    rows={4}
                    editable={!save.isPending}
                />
                <FieldGroup.SectionFooter>
                    <SettingsFooterText error={tooLong}>
                        {`${trimmed.length} / ${API_LIMITS.profileDescription.max}`}
                    </SettingsFooterText>
                </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section>
                <SettingsActionRow
                    title={save.isPending ? 'Збереження...' : 'Зберегти опис'}
                    disabled={!changed || tooLong || save.isPending}
                    onPress={() =>
                        save.mutate({ body: { description: trimmed || null } })
                    }
                />
            </FieldGroup.Section>
            <FieldGroup.Section>
                <SettingsNavRow
                    title="Посилання"
                    value={String(parseUserLinks(user.links).length)}
                    href="/settings/profile/links"
                />
            </FieldGroup.Section>
        </SettingsForm>
    );
};

const ProfileSettings: FC = () => {
    const { user, isPending, error, refetch } = useSession();

    if (!user) {
        return (
            <SettingsLoading
                isPending={isPending}
                error={error}
                onRetry={() => void refetch()}
            />
        );
    }

    return <ProfileForm user={user} />;
};

export default ProfileSettings;
