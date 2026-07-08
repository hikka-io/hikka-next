import { type FC, useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { type CommentResponse, editCommentMutation } from '@hikka/api';

import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { invalidateComments } from '@/utils/api/invalidate-content-state';

import CommentVerdictPicker from './comment-verdict-picker';
import type { Verdict } from './utils/review';

type Props = {
    comment: CommentResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const ConvertReviewDialog: FC<Props> = ({ comment, open, onOpenChange }) => {
    const queryClient = useQueryClient();
    const [verdict, setVerdict] = useState<Verdict | null>(null);

    useEffect(() => {
        if (!open) setVerdict(null);
    }, [open]);

    // Errors surface via the global MutationCache.onError toast in router.tsx;
    // a local onError here would double-toast.
    const mutation = useMutation({
        ...editCommentMutation(),
        onSuccess: () => {
            invalidateComments(queryClient);
            onOpenChange(false);
            toast.success('Коментар перетворено на відгук');
        },
    });

    const handleConfirm = () => {
        if (!comment.text || !verdict) return;

        mutation.mutate({
            path: { comment_reference: comment.reference },
            body: {
                text: comment.text,
                review: { recommended: verdict },
            },
        });
    };

    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange}>
            <ResponsiveModalContent
                className="md:max-w-md"
                title="Зробити відгуком"
                description="Оберіть вашу оцінку — коментар стане відгуком, текст залишиться без змін."
            >
                <CommentVerdictPicker
                    value={verdict}
                    onChange={setVerdict}
                    bare
                />
                <ResponsiveModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={mutation.isPending}
                    >
                        Відмінити
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={mutation.isPending || !verdict}
                    >
                        Зробити відгуком
                    </Button>
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default ConvertReviewDialog;
