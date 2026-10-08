import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    type ArticleDocumentResponse,
    deleteArticleMutation,
} from '@hikka/api';

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
import { invalidateArticles } from '@/utils/api/invalidate-content-state';
import { useRouter } from '@/utils/navigation';

type Props = {
    article: ArticleDocumentResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DeleteArticle: FC<Props> = ({ article, open, onOpenChange }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: mutateDeleteArticle } = useMutation({
        ...deleteArticleMutation(),
        onSuccess: () => {
            invalidateArticles(queryClient);
            toast.success('Статтю успішно видалено.');
            router.push('/articles');
        },
    });

    const handleDeleteArticle = async () => {
        mutateDeleteArticle({ path: { slug: article.slug } });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впевнені, що хочете видалити статтю?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Після цієї операції, Ви вже не зможете її відновити.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Відмінити</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteArticle}>
                        Підтвердити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteArticle;
