import Link from 'next/link';
import { FC } from 'react';

import MaterialSymbolsEditRounded from '../../../../components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsMoreHoriz from '../../../../components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import { Button } from '../../../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import { CONTENT_TYPE_LINKS } from '../../../../utils/constants/navigation';
import DeleteArticle from './delete-article';

interface Props {
    article: API.Article;
}

const ArticleMenu: FC<Props> = ({ article }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon-md">
                    <MaterialSymbolsMoreHoriz className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                    <Link
                        href={`${CONTENT_TYPE_LINKS['article']}/${article.slug}/update`}
                    >
                        <MaterialSymbolsEditRounded className="mr-2" />
                        Редагувати
                    </Link>
                </DropdownMenuItem>

                <DeleteArticle article={article} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ArticleMenu;
