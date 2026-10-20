import type { FC } from 'react';

import type { MenuAction } from '@expo/ui/community/menu';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { Ellipsis } from 'lucide-react-native';
import { Alert, View } from 'react-native';
import { toast } from 'sonner-native';

import type { CommentResponse } from '@hikka/api';

import { MENU_TRIGGER_SIZE, NativeMenu } from '@/components/tracking';
import { Icon } from '@/components/ui/icon';
import { useSession } from '@/features/auth';
import { shareSitePath } from '@/utils/share';
import { siteUrl } from '@/utils/site-origin';

import { composerHref, threadHref } from './comment-routes';
import { useDeleteComment } from './use-comment-mutations';

const MENU_SIZE = MENU_TRIGGER_SIZE;
const REPORT_URL = 'https://t.me/hikka_io';

type Props = {
    comment: CommentResponse;
    slug: string;
    /** Off where the list cannot show the edited text (a user's comment list opens the thread instead). */
    editable?: boolean;
};

/** The web's `CommentMenu` as a native menu: share, copy, edit, delete, report. */
const CommentMenu: FC<Props> = ({ comment, slug, editable = true }) => {
    const router = useRouter();
    const { user } = useSession();
    const deleteComment = useDeleteComment();

    const path = threadHref(
        comment.content_type,
        slug,
        comment.reference,
    ) as string;
    const isAuthor = !!user && user.username === comment.author.username;
    const canModerate =
        isAuthor || user?.role === 'admin' || user?.role === 'moderator';

    const copyLink = async () => {
        try {
            await Clipboard.setStringAsync(siteUrl(path));
            return true;
        } catch {
            toast.error('Не вдалося скопіювати посилання');
            return false;
        }
    };

    const confirmDelete = () => {
        void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning,
        );
        Alert.alert(
            'Ви впевнені, що хочете видалити коментар?',
            'Після цієї операції, Ви вже не зможете його відновити.',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Підтвердити',
                    style: 'destructive',
                    onPress: () =>
                        deleteComment.mutate({
                            path: { comment_reference: comment.reference },
                        }),
                },
            ],
        );
    };

    // The backend has no report endpoint yet: the link goes to the moderators by hand.
    const report = () => {
        Alert.alert(
            'Поскаржитися на коментар',
            'Ми скопіюємо посилання на коментар. Надішліть його модераторам Hikka в Telegram і коротко опишіть порушення.',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Відкрити Telegram',
                    onPress: async () => {
                        if (await copyLink()) void openBrowserAsync(REPORT_URL);
                    },
                },
            ],
        );
    };

    const actions: MenuAction[] = [
        { id: 'share', title: 'Поділитися', image: 'square.and.arrow.up' },
        { id: 'copy', title: 'Скопіювати посилання', image: 'link' },
        ...(editable && isAuthor && comment.is_editable
            ? [{ id: 'edit', title: 'Редагувати', image: 'pencil' as const }]
            : []),
        ...(user && !isAuthor
            ? [
                  {
                      id: 'report',
                      title: 'Поскаржитися',
                      image: 'exclamationmark.bubble' as const,
                  },
              ]
            : []),
        ...(canModerate
            ? [
                  {
                      id: 'delete',
                      title: 'Видалити',
                      image: 'trash' as const,
                      attributes: { destructive: true },
                  },
              ]
            : []),
    ];

    const onAction = (id: string) => {
        switch (id) {
            case 'share':
                void shareSitePath(path);
                break;
            case 'copy':
                void copyLink().then(
                    (copied) =>
                        copied && toast.success('Посилання скопійовано'),
                );
                break;
            case 'edit':
                router.push(
                    composerHref({
                        contentType: comment.content_type,
                        slug,
                        edit: comment.reference,
                    }),
                );
                break;
            case 'report':
                report();
                break;
            case 'delete':
                confirmDelete();
                break;
        }
    };

    return (
        <NativeMenu
            actions={actions}
            onAction={onAction}
            width={MENU_SIZE}
            height={MENU_SIZE}
            accessibilityLabel="Більше"
        >
            <View
                accessibilityRole="button"
                accessibilityLabel="Більше"
                className="size-11 items-center justify-center"
            >
                <Icon as={Ellipsis} className="size-5 text-muted-foreground" />
            </View>
        </NativeMenu>
    );
};

export default CommentMenu;
