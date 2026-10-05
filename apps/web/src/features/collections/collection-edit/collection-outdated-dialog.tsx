import type { FC } from 'react';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onReload: () => void;
    onOverwrite: () => void;
    isPending?: boolean;
};

const CollectionOutdatedDialog: FC<Props> = ({
    open,
    onOpenChange,
    onReload,
    onOverwrite,
    isPending,
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Колекцію вже змінили</AlertDialogTitle>
                    <AlertDialogDescription>
                        Поки Ви редагували, інший співавтор зберіг свою версію.
                        Можна завантажити його версію (Ваші зміни буде втрачено)
                        або зберегти Вашу поверх неї. Якщо скасувати, усе
                        введене залишиться на сторінці.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Скасувати
                    </AlertDialogCancel>
                    <Button
                        variant="outline"
                        size="md"
                        disabled={isPending}
                        onClick={onReload}
                    >
                        Завантажити нову версію
                    </Button>
                    <Button
                        size="md"
                        disabled={isPending}
                        onClick={onOverwrite}
                    >
                        Перезаписати
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CollectionOutdatedDialog;
