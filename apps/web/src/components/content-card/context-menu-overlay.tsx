import type { FC, ReactNode } from 'react';

import { Copy, Zap } from 'lucide-react';

import type { ContentTypeEnum } from '@hikka/api';

import { MaterialSymbolsEditRounded } from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsImageOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsImageOutlineRounded';
import MaterialSymbolsOpenInNewRounded from '@/components/icons/material-symbols/MaterialSymbolsOpenInNewRounded';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useSession } from '@/features/auth/hooks/use-session';
import { useQuickEdit } from '@/features/edit/quick-edit';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { Link } from '@/utils/navigation';

type Props = {
    children: ReactNode;
    slug: string;
    content_type: ContentTypeEnum;
    href?: string;
    image?: string | ReactNode;
    onOpenChange?: (open: boolean) => void;
};

const ContextMenuOverlay: FC<Props> = ({
    children,
    slug,
    content_type,
    href,
    image,
    onOpenChange,
}) => {
    const { user: loggedUser } = useSession();
    const quickEdit = useQuickEdit(content_type, slug);

    if (!loggedUser) {
        return children;
    }

    return (
        <>
            <ContextMenu
                onOpenChange={(open) => {
                    if (open) quickEdit.preload();
                    onOpenChange?.(open);
                }}
            >
                <ContextMenuTrigger>{children}</ContextMenuTrigger>
                <ContextMenuContent>
                    {href && (
                        <ContextMenuItem
                            render={<Link to={href} target="_blank" />}
                        >
                            <MaterialSymbolsOpenInNewRounded className="mr-2" />
                            Відкрити у новій вкладці
                        </ContextMenuItem>
                    )}
                    {image && typeof image === 'string' && (
                        <ContextMenuItem
                            render={<Link to={image} target="_blank" />}
                        >
                            <MaterialSymbolsImageOutlineRounded className="mr-2" />
                            Відкрити зображення
                        </ContextMenuItem>
                    )}
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        onClick={() =>
                            navigator.clipboard.writeText(
                                `${window.location.origin}${CONTENT_TYPE_LINKS[content_type]}/${slug}`,
                            )
                        }
                    >
                        <Copy className="mr-2 size-3" />
                        Скопіювати посилання
                    </ContextMenuItem>

                    <ContextMenuSeparator />
                    <ContextMenuItem
                        render={
                            <Link
                                to="/edit/new"
                                search={{ content_type, slug }}
                            />
                        }
                    >
                        <MaterialSymbolsEditRounded className="mr-2" />
                        Створити правку
                    </ContextMenuItem>
                    {quickEdit.canQuickEdit && (
                        <ContextMenuItem onClick={quickEdit.openDeferred}>
                            <Zap className="mr-2 size-3" />
                            Швидка правка
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>
            {quickEdit.modal}
        </>
    );
};

export default ContextMenuOverlay;
