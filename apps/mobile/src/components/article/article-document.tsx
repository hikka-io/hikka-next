import { type FC, useMemo } from 'react';

import { View } from 'react-native';

import { normalizeArticleDocument } from '@hikka/core';

import { cn } from '@/utils/cn';

import { ARTICLE_TEXT_CLASS } from './document-layout';
import { renderBlocks } from './render';

type Props = {
    document: unknown;
    authenticated?: boolean;
    selectable?: boolean;
    // A preview (list card) shows the document without links, spoilers or videos reacting to taps.
    interactive?: boolean;
    className?: string;
    textClassName?: string;
};

const ArticleDocument: FC<Props> = ({
    document,
    authenticated = false,
    selectable = false,
    interactive = true,
    className,
    textClassName = ARTICLE_TEXT_CLASS,
}) => {
    const blocks = useMemo(
        () => normalizeArticleDocument(document),
        [document],
    );

    return (
        <View
            pointerEvents={interactive ? 'auto' : 'none'}
            className={cn('gap-4', className)}
        >
            {renderBlocks(blocks, { authenticated, selectable, textClassName })}
        </View>
    );
};

export default ArticleDocument;
