import { type FC, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Star } from 'lucide-react';
import { toast } from 'sonner';

import {
    type CommentResponse,
    type CommentContentTypeEnum as CommentsContentType,
    hideCommentMutation,
} from '@hikka/api';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/features/auth/hooks/use-session';
import { useCommentsContext } from '@/services/providers/comments-provider';
import { invalidateComments } from '@/utils/api/invalidate-content-state';

import ConvertReviewDialog from './convert-review-dialog';
import { canConvertReview } from './utils/review';

type Props = {
    comment: CommentResponse;
    slug: string;
    content_type: CommentsContentType;
};

const CommentMenu: FC<Props> = ({ comment, slug, content_type }) => {
    const { setEdit, removePendingReply } = useCommentsContext();
    const queryClient = useQueryClient();

    const { user: loggedUser } = useSession();

    const deleteCommentMutation = useMutation({
        ...hideCommentMutation(),
        onSuccess: () => {
            removePendingReply(comment.reference);
            invalidateComments(queryClient);
        },
        onError: () =>
            toast.error(
                'Виникла помилка при видаленні повідомлення. Спробуйте, будь ласка, ще раз',
            ),
    });

    const handleDeleteComment = () => {
        deleteCommentMutation.mutate({
            path: { comment_reference: comment.reference },
        });
    };

    const handleCopy = () => {
        const path = `/comments/${content_type}/${slug}/${comment.reference}`;
        navigator.clipboard
            .writeText(`${window.location.origin}${path}`)
            .then(() => toast.success('Посилання скопійовано'))
            .catch(() => toast.error('Не вдалося скопіювати посилання'));
    };

    const isAuthor = loggedUser?.username === comment.author.username;
    const canModerate =
        isAuthor ||
        loggedUser?.role === 'admin' ||
        loggedUser?.role === 'moderator';

    const [convertOpen, setConvertOpen] = useState(false);

    const canConvert = canConvertReview({
        isAuthor,
        hidden: comment.hidden,
        text: comment.text,
        parent: comment.parent,
        contentType: content_type,
    });
    const isReview = !!comment.review;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 text-muted-foreground"
                        aria-label="Більше"
                    >
                        <MaterialSymbolsMoreHoriz />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={handleCopy}>
                        <Copy />
                        Скопіювати посилання
                    </DropdownMenuItem>
                    {isAuthor && (
                        <DropdownMenuItem
                            onClick={() => setEdit(comment.reference)}
                        >
                            <MaterialSymbolsEditRounded />
                            Редагувати
                        </DropdownMenuItem>
                    )}
                    {canConvert && !isReview && (
                        <DropdownMenuItem onSelect={() => setConvertOpen(true)}>
                            <Star />
                            Зробити відгуком
                        </DropdownMenuItem>
                    )}
                    {canModerate && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive-foreground"
                                >
                                    <MaterialSymbolsDeleteForeverRounded />
                                    Видалити
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Ви впевнені, що хочете видалити
                                        коментар?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Після цієї операції, Ви вже не зможете
                                        його відновити.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Відмінити
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteComment}
                                    >
                                        Підтвердити
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {convertOpen && (
                <ConvertReviewDialog
                    comment={comment}
                    open={convertOpen}
                    onOpenChange={setConvertOpen}
                />
            )}
        </>
    );
};

export default CommentMenu;
