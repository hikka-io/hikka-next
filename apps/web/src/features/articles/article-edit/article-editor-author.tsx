import type { FC } from 'react';

import type { FollowUserResponse } from '@hikka/api';

import Card from '@/components/ui/card';

import ArticleAuthorCard from '../article-author-card';
import { useArticleContext } from './article-provider';
import SaveStatus from './publish-card/save-status';

type Props = {
    author: Pick<FollowUserResponse, 'username' | 'avatar'>;
};

const ArticleEditorAuthor: FC<Props> = ({ author }) => {
    const category = useArticleContext((state) => state.category);

    return (
        <Card className="gap-0 overflow-hidden p-0">
            <ArticleAuthorCard
                article={{ author, category }}
                status={<SaveStatus />}
                className="surface"
            />
        </Card>
    );
};

export default ArticleEditorAuthor;
