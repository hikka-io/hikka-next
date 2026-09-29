import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArticleOptions } from '@hikka/api';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import PageActionsMenu from '@/components/page-actions-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useSession } from '@/services/session';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { Link, useParams } from '@/utils/navigation';

import DeleteArticle from './delete-article';

type Props = {
    className?: string;
};

const ArticleViewActionsMenu: FC<Props> = ({ className }) => {
    const params = useParams();
    const slug = String(params.slug);
    const { user: loggedUser, isAdmin, isModerator } = useSession();

    const { data: article } = useQuery(getArticleOptions({ path: { slug } }));
    const [deleteOpen, setDeleteOpen] = useState(false);

    const articleUrl = `${CONTENT_TYPE_LINKS.article}/${slug}`;
    const canManage =
        !!article &&
        (loggedUser?.username === article.author.username ||
            isAdmin() ||
            isModerator());

    return (
        <>
            <PageActionsMenu url={articleUrl} className={className}>
                {canManage && (
                    <>
                        <DropdownMenuItem
                            render={<Link to={`${articleUrl}/update`} />}
                        >
                            <MaterialSymbolsEditRounded />
                            Редагувати
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setDeleteOpen(true)}
                            className="text-destructive-foreground"
                        >
                            <MaterialSymbolsDeleteForeverRounded />
                            Видалити
                        </DropdownMenuItem>
                    </>
                )}
            </PageActionsMenu>
            {canManage && (
                <DeleteArticle
                    article={article}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                />
            )}
        </>
    );
};

export default ArticleViewActionsMenu;
