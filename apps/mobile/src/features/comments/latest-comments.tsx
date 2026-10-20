import type { FC } from 'react';

import CommentFeedList from './comment-feed-list';
import { latestCommentsOptions } from './queries';

/** The web's `/comments/latest`: the community's newest comments across every thread. */
const LatestComments: FC = () => (
    <CommentFeedList
        options={latestCommentsOptions()}
        emptyTitle="Коментарів ще немає"
        emptyDescription="Тут зʼявляться останні коментарі спільноти"
    />
);

export default LatestComments;
