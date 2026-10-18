import type { FC } from 'react';

import { useArticleContext } from '../article-provider';
import type { ArticleSave } from '../use-article-save';
import PublishButton from './publish-button';
import SaveButton from './save-button';

type Props = {
    save: ArticleSave;
};

const PublishActions: FC<Props> = ({ save }) => {
    const draft = useArticleContext((state) => state.draft);

    return (
        <div className="flex w-full gap-2">
            <SaveButton save={save.save} className="flex-1" />
            {draft && (
                <PublishButton publish={save.publish} className="flex-1" />
            )}
        </div>
    );
};

export default PublishActions;
