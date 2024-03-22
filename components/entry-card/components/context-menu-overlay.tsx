import * as React from 'react';
import { ReactNode } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import Link from 'next/link';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useAuthContext } from '@/services/providers/auth-provider';


const ContextMenuOverlay = ({
    children,
    slug,
    content_type,
}: {
    children: ReactNode;
    slug: string;
    content_type: API.ContentType;
}) => {
    const { secret } = useAuthContext();

    if (!secret) {
        return children;
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem asChild>
                    <Link
                        href={`/edit/new?content_type=${content_type}&slug=${slug}`}
                    >
                        <MaterialSymbolsEditRounded className="mr-2" />
                        Створити правку
                    </Link>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default ContextMenuOverlay;
