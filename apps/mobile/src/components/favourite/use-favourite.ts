import {
    useMutation,
    useMutationState,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { useResolveClassNames } from 'uniwind';

import {
    type FavouriteContentTypeEnum,
    favouriteAddMutation,
    favouriteDeleteMutation,
} from '@hikka/api';
import {
    apiErrorMessage,
    favouriteEntryOptions,
    MUTATION_META_SKIP_ERROR_TOAST,
} from '@hikka/core';

import { isDeadTokenError, signOut, useSession } from '@/features/auth';
import {
    applyFavouriteDeletion,
    applyFavouriteMutation,
} from '@/utils/api/invalidate-content-state';

const FAVOURITE_KEY = 'favourite';
const ADD = 'add';
const ACTIVE_CLASS = 'text-red-500';

type Target = { content_type: FavouriteContentTypeEnum; slug: string };

export type FavouriteState = {
    status: 'signed-out' | 'loading' | 'error' | 'ready';
    isFavourite: boolean;
    /** The filled heart's colour, the web's `text-red-500`. */
    activeColor: string | undefined;
    onPress: () => void;
};

const isTarget = (variables: unknown, target: Target) => {
    const path = (variables as { path?: Partial<Target> } | undefined)?.path;
    return (
        path?.content_type === target.content_type && path.slug === target.slug
    );
};

/**
 * The viewer's favourite for one item and its toggle. Writes for one item share a mutation
 * scope, so quick taps run in order, and the heart shows the last queued write until the
 * queue drains; an unreadable favourite never writes, a tap re-reads it.
 */
export function useFavourite(
    content_type: FavouriteContentTypeEnum,
    slug: string,
): FavouriteState {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { hasToken } = useSession();
    const { color } = useResolveClassNames(ACTIVE_CLASS);
    const target = { content_type, slug };

    const entry = useQuery({
        ...favouriteEntryOptions(content_type, slug),
        enabled: hasToken,
    });

    const queued = useMutationState({
        filters: {
            mutationKey: [FAVOURITE_KEY],
            status: 'pending',
            predicate: (mutation) => isTarget(mutation.state.variables, target),
        },
        select: (mutation) => mutation.options.mutationKey?.[1] === ADD,
    });

    const scope = { id: `favourite-${content_type}-${slug}` };

    const onError = (error: unknown) => {
        if (isDeadTokenError(error)) {
            void signOut();
            return;
        }
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        toast.error(apiErrorMessage(error, 'Не вдалося оновити улюблене'));
        void entry.refetch();
    };

    const notifySuccess = () =>
        void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
        );

    const add = useMutation({
        ...favouriteAddMutation(),
        mutationKey: [FAVOURITE_KEY, ADD],
        scope,
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        onSuccess: (data, { path }) => {
            void applyFavouriteMutation(
                queryClient,
                path.content_type,
                path.slug,
                data,
            );
            notifySuccess();
        },
        onError,
    });

    const remove = useMutation({
        ...favouriteDeleteMutation(),
        mutationKey: [FAVOURITE_KEY, 'delete'],
        scope,
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        onSuccess: (_, { path }) => {
            void applyFavouriteDeletion(
                queryClient,
                path.content_type,
                path.slug,
            );
            notifySuccess();
        },
        onError,
    });

    const status: FavouriteState['status'] = !hasToken
        ? 'signed-out'
        : entry.data !== undefined
          ? 'ready'
          : entry.isError
            ? 'error'
            : 'loading';

    const isFavourite =
        queued.length > 0
            ? queued[queued.length - 1]
            : status === 'ready' && entry.data !== null;

    const onPress = () => {
        if (status === 'signed-out') {
            router.push('/login');
            return;
        }
        if (status === 'error') {
            void entry.refetch();
            return;
        }
        if (status === 'loading') return;

        void Haptics.selectionAsync();
        (isFavourite ? remove : add).mutate({ path: target });
    };

    return {
        status,
        isFavourite,
        activeColor: typeof color === 'string' ? color : undefined,
        onPress,
    };
}
