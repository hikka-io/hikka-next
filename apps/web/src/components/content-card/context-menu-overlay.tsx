import { type FC, type ReactNode, useState } from 'react';

import { Copy, Zap } from 'lucide-react';

import { ContentTypeEnum, type EditContentTypeEnum } from '@hikka/api';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useSession } from '@/features/auth/hooks/use-session';
import { QuickEditModal } from '@/features/edit/quick-edit';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

import { MaterialSymbolsEditRounded } from '../icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsImageOutlineRounded from '../icons/material-symbols/MaterialSymbolsImageOutlineRounded';
import MaterialSymbolsOpenInNewRounded from '../icons/material-symbols/MaterialSymbolsOpenInNewRounded';

const EDITABLE_CONTENT_TYPES = new Set<ContentTypeEnum>([
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
]);

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
    const { user: loggedUser, isModerator } = useSession();
    const [quickEditOpen, setQuickEditOpen] = useState(false);

    if (!loggedUser) {
        return children;
    }

    const canQuickEdit =
        isModerator() && EDITABLE_CONTENT_TYPES.has(content_type);

    return (
        <>
            <ContextMenu onOpenChange={onOpenChange}>
                <ContextMenuTrigger>{children}</ContextMenuTrigger>
                <ContextMenuContent>
                    {href && (
                        <ContextMenuItem asChild>
                            <Link to={href} target="_blank">
                                <MaterialSymbolsOpenInNewRounded className="mr-2" />
                                Відкрити у новій вкладці
                            </Link>
                        </ContextMenuItem>
                    )}
                    {image && typeof image === 'string' && (
                        <ContextMenuItem asChild>
                            <Link to={image} target="_blank">
                                <MaterialSymbolsImageOutlineRounded className="mr-2" />
                                Відкрити зображення
                            </Link>
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
                    <ContextMenuItem asChild>
                        <Link to="/edit/new" search={{ content_type, slug }}>
                            <MaterialSymbolsEditRounded className="mr-2" />
                            Створити правку
                        </Link>
                    </ContextMenuItem>
                    {canQuickEdit && (
                        <ContextMenuItem
                            onSelect={() => {
                                // Defer so the menu finishes closing (releasing the
                                // `pointer-events: none` it sets on <body>) before the
                                // dialog opens and takes focus.
                                setTimeout(() => setQuickEditOpen(true), 0);
                            }}
                        >
                            <Zap className="mr-2 size-3" />
                            Швидка правка
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>
            {canQuickEdit && (
                <QuickEditModal
                    slug={slug}
                    content_type={content_type as EditContentTypeEnum}
                    open={quickEditOpen}
                    onOpenChange={setQuickEditOpen}
                />
            )}
        </>
    );
};

export default ContextMenuOverlay;
