'use client';

import React, { PropsWithChildren } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '@/utils';

interface Props extends PropsWithChildren {
    className?: string;
    id: string;
    open: boolean;
    onDismiss?: () => void;
    boxClassName?: string;
    title?: string;
    disableHeader?: boolean;
    noEscape?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const Component = ({
    className,
    boxClassName,
    open,
    id,
    children,
    onDismiss,
    title,
    noEscape,
    onOpenChange,
    disableHeader,
}: Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent id={id} className={cn('overflow-y-scroll max-h-screen no-scrollbar', boxClassName)}>
                {!disableHeader && title && (
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                )}
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default Component;