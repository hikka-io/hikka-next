import type { FC } from 'react';

import type { ArticleBlockNode } from '@hikka/core';

import { ARTICLE_TEXT_CLASS } from './document-layout';
import { renderBlocks } from './render';

type Props = {
    block: ArticleBlockNode;
    authenticated?: boolean;
    selectable?: boolean;
    textClassName?: string;
};

/** One top-level block of a normalized document, for lists that mount blocks as they scroll in. */
const ArticleBlock: FC<Props> = ({
    block,
    authenticated = false,
    selectable = false,
    textClassName = ARTICLE_TEXT_CLASS,
}) => (
    <>{renderBlocks([block], { authenticated, selectable, textClassName })}</>
);

export default ArticleBlock;
