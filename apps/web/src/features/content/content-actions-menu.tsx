import type { FC } from 'react';

import { Zap } from 'lucide-react';

import type { EditContentTypeEnum } from '@hikka/api';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import PageActionsMenu from '@/components/page-actions-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useSession } from '@/features/auth/hooks/use-session';
import { useQuickEdit } from '@/features/edit';
import { Link } from '@/utils/navigation';

type Props = {
    url: string;
    slug: string;
    contentType: EditContentTypeEnum;
};

const ContentActionsMenu: FC<Props> = ({ url, slug, contentType }) => {
    const { user: loggedUser } = useSession();
    const quickEdit = useQuickEdit(contentType, slug);

    return (
        <>
            <PageActionsMenu url={url}>
                {loggedUser && (
                    <>
                        <DropdownMenuItem
                            render={
                                <Link
                                    to="/edit/new"
                                    search={{ content_type: contentType, slug }}
                                />
                            }
                        >
                            <MaterialSymbolsEditRounded />
                            Створити правку
                        </DropdownMenuItem>
                        {quickEdit.canQuickEdit && (
                            <DropdownMenuItem
                                onPointerEnter={quickEdit.preload}
                                onClick={quickEdit.openDeferred}
                            >
                                <Zap />
                                Швидка правка
                            </DropdownMenuItem>
                        )}
                    </>
                )}
            </PageActionsMenu>
            {quickEdit.modal}
        </>
    );
};

export default ContentActionsMenu;
