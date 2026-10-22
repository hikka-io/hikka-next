import { type FC, useState } from 'react';

import { CopyPlus, Zap } from 'lucide-react';

import type { EditContentTypeEnum } from '@hikka/api';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import PageActionsMenu from '@/components/page-actions-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { AddToCollectionDrawer } from '@/features/collections';
import { useQuickEdit } from '@/features/edit';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useSession } from '@/services/session';
import { Link } from '@/utils/navigation';

type Props = {
    url: string;
    slug: string;
    contentType: EditContentTypeEnum;
};

const ContentActionsMenu: FC<Props> = ({ url, slug, contentType }) => {
    const { user: loggedUser } = useSession();
    const quickEdit = useQuickEdit(contentType, slug);
    const [collectionOpen, setCollectionOpen] = useState(false);
    useCloseOnRouteChange(setCollectionOpen);

    // Defer so a closing menu releases its `pointer-events: none` on <body>.
    const openCollection = () => setTimeout(() => setCollectionOpen(true), 0);

    return (
        <>
            <PageActionsMenu url={url}>
                {loggedUser && (
                    <>
                        <DropdownMenuItem onClick={openCollection}>
                            <CopyPlus />
                            Додати до колекції
                        </DropdownMenuItem>
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
            {loggedUser && (
                <AddToCollectionDrawer
                    content_type={contentType}
                    slug={slug}
                    open={collectionOpen}
                    onOpenChange={setCollectionOpen}
                />
            )}
        </>
    );
};

export default ContentActionsMenu;
