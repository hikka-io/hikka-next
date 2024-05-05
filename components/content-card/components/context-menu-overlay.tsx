import * as React from 'react';
import { FC, ReactNode } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import Link from 'next/link';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import useSession from '@/services/hooks/auth/useSession';

interface Props {
    children: ReactNode;
    slug: string;
    content_type: API.ContentType;
}

const ContextMenuOverlay: FC<Props> = ({ children, slug, content_type }) => {
    const { user: loggedUser } = useSession();

    if (!loggedUser) {
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
