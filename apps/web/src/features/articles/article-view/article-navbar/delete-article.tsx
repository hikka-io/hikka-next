import { ArticleResponse } from '@hikka/client';
import { useDeleteArticle } from '@hikka/react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { FC } from 'react';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Props {
    article: ArticleResponse;
}

const DeleteArticle: FC<Props> = ({ article }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const deleteArticleMutation = useDeleteArticle({
        options: {
            onSuccess: () => {
                enqueueSnackbar('Статтю успішно видалено.', {
                    variant: 'success',
                });
                router.push('/articles');
            },
        },
    });

    const handleDeleteArticle = async () => {
        deleteArticleMutation.mutate(article.slug);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive"
                >
                    <MaterialSymbolsDeleteForeverRounded className="mr-2" />
                    Видалити
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впевнені, що хочете видалити коментар?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Після цієї операції, Ви вже не зможете його відновити.
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
