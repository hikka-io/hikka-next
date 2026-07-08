import { type FC, useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    type CommentResponse,
    HikkaApiError,
    editCommentMutation,
} from '@hikka/api';

import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { invalidateComments } from '@/utils/api/invalidate-content-state';

import CommentVerdictPicker from './comment-verdict-picker';
import type { Verdict } from './utils/review';

type Mode = 'to-review' | 'to-comment';

type Props = {
    comment: CommentResponse;
    mode: Mode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const COPY: Record<
    Mode,
    { title: string; description: string; confirm: string }
> = {
    'to-review': {
        title: 'Зробити відгуком',
        description:
            'Оберіть вашу оцінку — коментар стане відгуком, текст залишиться без змін.',
        confirm: 'Зробити відгуком',
    },
    'to-comment': {
        title: 'Зробити коментарем',
        description:
            'Оцінку буде видалено, текст залишиться як звичайний коментар.',
        confirm: 'Підтвердити',
    },
};

const ConvertReviewDialog: FC<Props> = ({
    comment,
    mode,
    open,
    onOpenChange,
}) => {
    const queryClient = useQueryClient();
    const [verdict, setVerdict] = useState<Verdict | null>(null);

    useEffect(() => {
        if (!open) setVerdict(null);
    }, [open]);

    const mutation = useMutation({
        ...editCommentMutation(),
        onSuccess: () => {
            invalidateComments(queryClient);
            onOpenChange(false);
            toast.success(
                mode === 'to-review'
                    ? 'Коментар перетворено на відгук'
                    : 'Відгук перетворено на коментар',
            );
        },
        onError: (error) => {
            toast.error(
                error instanceof HikkaApiError && error.message
                    ? error.message
                    : 'Не вдалося змінити тип повідомлення. Спробуйте, будь ласка, ще раз',
            );
        },
    });

    const handleConfirm = () => {
        if (!comment.text) return;

        mutation.mutate({
            path: { comment_reference: comment.reference },
            body: {
                text: comment.text,
                review:
                    mode === 'to-review' && verdict
                        ? { recommended: verdict }
                        : null,
            },
        });
    };

    const copy = COPY[mode];
    const confirmDisabled =
        mutation.isPending || (mode === 'to-review' && !verdict);

    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange}>
            <ResponsiveModalContent
                className="md:max-w-md"
                title={copy.title}
                description={copy.description}
            >
                {mode === 'to-review' && (
                    <CommentVerdictPicker
                        value={verdict}
                        onChange={setVerdict}
                        className="border-t-0"
                    />
                )}
                <ResponsiveModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={mutation.isPending}
                    >
                        Відмінити
                    </Button>
                    <Button onClick={handleConfirm} disabled={confirmDisabled}>
                        {copy.confirm}
                    </Button>
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default ConvertReviewDialog;
