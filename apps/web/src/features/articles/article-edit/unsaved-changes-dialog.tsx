import type { FC } from 'react';

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
import type { usePreventUnsavedClose } from '@/services/hooks/use-prevent-unsaved-close';

type Props = {
    blocker: ReturnType<typeof usePreventUnsavedClose>;
};

const UnsavedChangesDialog: FC<Props> = ({ blocker }) => {
    const open = blocker.status === 'blocked';

    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => !next && blocker.reset?.()}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Є незбережені зміни</AlertDialogTitle>
                    <AlertDialogDescription>
                        Якщо вийти зараз, останні зміни буде втрачено.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Залишитися</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={() => blocker.proceed?.()}
                    >
                        Вийти без збереження
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UnsavedChangesDialog;
