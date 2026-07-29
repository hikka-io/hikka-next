import type { FC } from 'react';

import type { CommentResponse } from '@hikka/api';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useReviewConversion } from './hooks';

type Props = {
    comment: CommentResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DemoteReviewDialog: FC<Props> = ({ comment, open, onOpenChange }) => {
    const { convert, isPending } = useReviewConversion({
        comment,
        onOpenChange,
        successMessage: 'Відгук знято',
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Зробити коментарем?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ваша рекомендація буде прибрана, а запис зникне зі
                        статистики відгуків. Текст залишиться без змін.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Відмінити
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            convert(null);
                        }}
                        disabled={isPending || !comment.text}
                    >
                        Зробити коментарем
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DemoteReviewDialog;
