'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';
import * as React from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { cn } from '@/utils/cn';

function Command({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
    return (
        <CommandPrimitive
            data-slot="command"
            className={cn(
                'bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-xl!',
                className,
            )}
            {...props}
        />
    );
}

function CommandDialog({
    title = 'Command Palette',
    description = 'Search for a command to run...',
    children,
    className,
    showCloseButton = false,
    shouldFilter,
    ...props
}: React.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
    shouldFilter?: boolean;
}) {
    return (
        <Dialog {...props}>
            <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogContent
                className={cn(
                    'flex max-h-[calc(var(--visual-viewport-height,100dvh)*0.8)] flex-col overflow-hidden rounded-xl! p-0 sm:max-w-lg',
                    className,
                )}
                showCloseButton={showCloseButton}
            >
                <Command
                    shouldFilter={shouldFilter}
                    className="**:[[cmdk-group-heading]]:text-muted-foreground h-auto max-h-full [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:size-5 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group]]:px-2 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-3"
                >
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

function CommandInput({
    className,
    children,
    leftSideNode,
    containerClassName,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
    leftSideNode?: React.ReactNode;
} & {
    children?: React.ReactNode;
    containerClassName?: string;
}) {
    return (
        <div
            data-slot="command-input-wrapper"
            className={cn(
                'flex items-center gap-3 border-b px-3',
                containerClassName,
            )}
            cmdk-input-wrapper=""
        >
            {leftSideNode || (
                <SearchIcon className="size-4 shrink-0 opacity-50" />
            )}
            <CommandPrimitive.Input
                data-slot="command-input"
                className={cn(
                    'placeholder:text-muted-foreground flex h-11 w-full bg-transparent px-0 py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                {...props}
            />
            {children}
        </div>
    );
}

function CommandList({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
    return (
        <CommandPrimitive.List
            data-slot="command-list"
            className={cn(
                'no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none',
                className,
            )}
            {...props}
        />
    );
}

function CommandEmpty({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
    return (
        <CommandPrimitive.Empty
            data-slot="command-empty"
            className={cn('py-6 text-center text-sm', className)}
            {...props}
        />
    );
}

function CommandGroup({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
    return (
        <CommandPrimitive.Group
            data-slot="command-group"
            className={cn(
                'text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1! **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium',
                className,
            )}
            {...props}
        />
    );
}

function CommandSeparator({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return (
        <CommandPrimitive.Separator
            data-slot="command-separator"
            className={cn('bg-border -mx-1 h-px', className)}
            {...props}
        />
    );
}

function CommandItem({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
    return (
        <CommandPrimitive.Item
            data-slot="command-item"
            className={cn(
                "data-[selected='true']:bg-muted data-[selected=true]:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm p-2! text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                className,
            )}
            {...props}
        />
    );
}

function CommandShortcut({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="command-shortcut"
            className={cn(
                'text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-xs tracking-widest',
                className,
            )}
            {...props}
        />
    );
}

export {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
};
