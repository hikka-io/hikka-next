import { type FC, useState } from 'react';

import { Zap } from 'lucide-react';

import type { EditContentTypeEnum } from '@hikka/api';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import PageActionsMenu from '@/components/page-actions-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useSession } from '@/features/auth/hooks/use-session';
import { QuickEditModal } from '@/features/edit/quick-edit';
import { Link } from '@/utils/navigation';

type Props = {
    url: string;
    slug: string;
    contentType: EditContentTypeEnum;
};

const ContentActionsMenu: FC<Props> = ({ url, slug, contentType }) => {
    const { user: loggedUser, isModerator } = useSession();
    const [quickEditOpen, setQuickEditOpen] = useState(false);

    const canQuickEdit = isModerator();

    return (
        <>
            <PageActionsMenu url={url}>
                {loggedUser && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/edit/new"
                                search={{ content_type: contentType, slug }}
                            >
                                <MaterialSymbolsEditRounded />
                                Створити правку
                            </Link>
                        </DropdownMenuItem>
                        {canQuickEdit && (
                            <DropdownMenuItem
                                onSelect={() => {
                                    // Defer so the menu finishes closing and releases the
                                    // `pointer-events: none` it sets on <body>.
                                    setTimeout(() => setQuickEditOpen(true), 0);
                                }}
                            >
                                <Zap />
                                Швидка правка
                            </DropdownMenuItem>
                        )}
                    </>
                )}
            </PageActionsMenu>
            {canQuickEdit && (
                <QuickEditModal
                    slug={slug}
                    content_type={contentType}
                    open={quickEditOpen}
                    onOpenChange={setQuickEditOpen}
                />
            )}
        </>
    );
};

export default ContentActionsMenu;
