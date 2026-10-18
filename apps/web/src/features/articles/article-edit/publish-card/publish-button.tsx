import type { FC } from 'react';

import MaterialSymbolsPublishRounded from '@/components/icons/material-symbols/MaterialSymbolsPublishRounded';
import { Button } from '@/components/ui/button';

import { useArticleContext } from '../article-provider';
import { type ArticleSave, selectPublishDisabled } from '../use-article-save';

type Props = Pick<ArticleSave, 'publish'> & {
    className?: string;
};

const PublishButton: FC<Props> = ({ publish, className }) => {
    const disabled = useArticleContext(selectPublishDisabled);

    return (
        <Button
            size="md"
            className={className}
            disabled={disabled}
            onClick={publish}
        >
            <MaterialSymbolsPublishRounded />
            Опублікувати
        </Button>
    );
};

export default PublishButton;
