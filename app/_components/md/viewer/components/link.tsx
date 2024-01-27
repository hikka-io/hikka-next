import React, { PropsWithChildren } from 'react';
import MaterialSymbolsLinkRounded from '~icons/material-symbols/link-rounded';

import Link from 'next/link';

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
} from '@/app/_components/ui/alert-dialog';

interface Props {
    href: string;
}

const Component = ({ children, href }: PropsWithChildren<Props>) => {
    if (href.includes('hikka.io')) {
        return <Link href={href}>{children}</Link>;
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className="cursor-pointer text-primary hover:underline">
                    {children}
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впевнені, що хочете відкрити посилання?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex gap-2 items-center">
                            <MaterialSymbolsLinkRounded />
                            <p className="flex-1">{href}</p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Відмінити</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => window.open(href, '_ blank')}
                    >
                        Продовжити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Component;