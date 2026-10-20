import type { FC } from 'react';

import {
    useIsMutating,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { UserMinus, UserPlus } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';
import { toast } from 'sonner-native';

import { followMutation, unfollowMutation } from '@hikka/api';
import { apiErrorMessage, MUTATION_META_SKIP_ERROR_TOAST } from '@hikka/core';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { isDeadTokenError, signOut, useSession } from '@/features/auth';
import { applyFollowChange } from '@/utils/api/invalidate-content-state';

const FOLLOW_KEY = ['user', 'follow'] as const;

type FollowVariables = { path: { username: string } };

type Props = {
    user: { username: string | null; is_followed: boolean };
    size?: 'md' | 'sm';
    className?: string;
    containerClassName?: string;
};

const notifyError = (error: unknown) => {
    if (isDeadTokenError(error)) {
        void signOut();
        return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    toast.error(apiErrorMessage(error, 'Не вдалося оновити підписку'));
};

/** The web's `FollowButton`: login for guests, nothing on the viewer's own profile. */
const FollowButton: FC<Props> = ({
    user,
    size = 'md',
    className,
    containerClassName,
}) => {
    const queryClient = useQueryClient();
    const { user: viewer, hasToken } = useSession();
    const username = user.username;
    // Username-bound, so a recycled list row never shows another user's pending write.
    const pending =
        useIsMutating({
            mutationKey: FOLLOW_KEY,
            predicate: (mutation) =>
                (mutation.state.variables as FollowVariables | undefined)?.path
                    .username === username,
        }) > 0;

    const onSuccess =
        (is_followed: boolean) => (_: unknown, variables: FollowVariables) => {
            void applyFollowChange(queryClient, {
                username: variables.path.username,
                is_followed,
            });
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
            );
        };

    const follow = useMutation({
        ...followMutation(),
        mutationKey: FOLLOW_KEY,
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        onSuccess: onSuccess(true),
        onError: notifyError,
    });
    const unfollow = useMutation({
        ...unfollowMutation(),
        mutationKey: FOLLOW_KEY,
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        onSuccess: onSuccess(false),
        onError: notifyError,
    });

    if (!username) return null;

    if (!hasToken) {
        return (
            <Link href="/login" asChild>
                <Button
                    variant="outline"
                    size={size}
                    className={className}
                    containerClassName={containerClassName}
                >
                    <Icon as={UserPlus} />
                    Відстежувати
                </Button>
            </Link>
        );
    }

    if (!viewer || viewer.username === username) return null;

    const followed = user.is_followed;

    return (
        <Button
            variant={followed ? 'outline' : 'default'}
            size={size}
            disabled={pending}
            accessibilityState={{ busy: pending }}
            className={className}
            containerClassName={containerClassName}
            onPress={() =>
                (followed ? unfollow : follow).mutate({ path: { username } })
            }
        >
            {pending ? (
                <ActivityIndicator size="small" />
            ) : (
                <Icon as={followed ? UserMinus : UserPlus} />
            )}
            {followed ? 'Не стежити' : 'Відстежувати'}
        </Button>
    );
};

export default FollowButton;
