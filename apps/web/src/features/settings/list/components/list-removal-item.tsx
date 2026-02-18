'use client';

import Small from '@/components/typography/small';
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
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Props {
    title: string;
    onConfirm: () => void;
}

const ListRemovalItem = ({ title, onConfirm }: Props) => {
    return (
        <Card className="flex-row items-center justify-between">
            <div className="flex flex-col">
                <Label>{title}</Label>
                <Small className="text-muted-foreground">
                    Очистити весь <span className="lowercase">{title}</span>
                </Small>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="md">
                        Видалити
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Ви впевнені, що хочете видалити{' '}
                            <span className="lowercase">{title}</span>?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Після цієї операції, Ви вже не зможете його
                            відновити.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Відмінити</AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirm}>
                            Підтвердити
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

export default ListRemovalItem;
