import { ContentTypeEnum } from '@hikka/client';
import { useSession } from '@hikka/react';
import { Copy } from 'lucide-react';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { UrlObject } from 'url';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';

import { MaterialSymbolsEditRounded } from '../icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsImageOutlineRounded from '../icons/material-symbols/MaterialSymbolsImageOutlineRounded';
import MaterialSymbolsOpenInNewRounded from '../icons/material-symbols/MaterialSymbolsOpenInNewRounded';

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
                <ContextMenuSeparator />
                <ContextMenuItem
                    onClick={() =>
                        navigator.clipboard.writeText(
                            `${window.location.origin}/${content_type}/${slug}`,
                        )
                    }
                >
                    <Copy className="mr-2 size-3" />
                    Скопіювати посилання
                </ContextMenuItem>

                <ContextMenuSeparator />
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
