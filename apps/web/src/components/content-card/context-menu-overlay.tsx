import { ContentTypeEnum } from '@hikka/client';
import { useSession } from '@hikka/react';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { UrlObject } from 'url';

import { MaterialSymbolsEditRounded } from '../icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsImageOutlineRounded from '../icons/material-symbols/MaterialSymbolsImageOutlineRounded';
import MaterialSymbolsOpenInNewRounded from '../icons/material-symbols/MaterialSymbolsOpenInNewRounded';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '../ui/context-menu';

interface Props {
    children: ReactNode;
    slug: string;
    content_type: ContentTypeEnum;
    href?: string | UrlObject;
    image?: string | ReactNode;
}

const ContextMenuOverlay: FC<Props> = ({
    children,
    slug,
    content_type,
    href,
    image,
}) => {
    const { user: loggedUser } = useSession();

    if (!loggedUser) {
        return children;
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                {href && (
                    <ContextMenuItem asChild>
                        <Link href={href} target="_blank">
                            <MaterialSymbolsOpenInNewRounded className="mr-2" />
                            Відкрити у новій вкладці
                        </Link>
                    </ContextMenuItem>
                )}
                {image && typeof image === 'string' && (
                    <ContextMenuItem asChild>
                        <Link href={image} target="_blank">
                            <MaterialSymbolsImageOutlineRounded className="mr-2" />
                            Відкрити зображення
                        </Link>
                    </ContextMenuItem>
                )}
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
