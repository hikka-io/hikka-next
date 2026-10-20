import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';

import { type CommentTypeEnum, serviceUserStatsOptions } from '@hikka/api';
import {
    type CommentOrder,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
} from '@hikka/core';

import CommentFeedList from './comment-feed-list';
import CommentSortMenu from './comment-sort-menu';
import CommentTypeChips from './comment-type-chips';
import { userCommentListOptions } from './queries';

type Props = {
    username: string;
    /** The type a link asked for (`?comment_type=review` from the profile's counts). */
    initialType?: CommentTypeEnum;
};

/** The web's `UserCommentList`: a user's comments by type, sort and "Без відповідей". */
const UserComments: FC<Props> = ({ username, initialType = 'all' }) => {
    const [sort, setSort] = useState<string>(DEFAULT_COMMENT_SORT);
    const [order, setOrder] = useState<CommentOrder>(DEFAULT_COMMENT_ORDER);
    const [commentType, setCommentType] =
        useState<CommentTypeEnum>(initialType);
    const [firstLevelOnly, setFirstLevelOnly] = useState(false);
    const { data: stats } = useQuery(
        serviceUserStatsOptions({ path: { username } }),
    );

    return (
        <>
            <CommentSortMenu
                sort={sort}
                order={order}
                onSortChange={setSort}
                onOrderChange={setOrder}
                firstLevelOnly={firstLevelOnly}
                onFirstLevelOnlyChange={setFirstLevelOnly}
            />
            <CommentFeedList
                options={userCommentListOptions(username, {
                    commentType,
                    sort,
                    order,
                    firstLevelOnly,
                })}
                header={
                    <View className="px-4 pb-6">
                        <CommentTypeChips
                            value={commentType}
                            onChange={setCommentType}
                            commentsCount={stats?.comments_count}
                            reviewsCount={stats?.reviews_count}
                        />
                    </View>
                }
                emptyTitle={
                    commentType === 'review'
                        ? 'Відгуків не знайдено'
                        : 'Коментарів не знайдено'
                }
                emptyDescription={
                    commentType === 'review'
                        ? "Тут з'являться відгуки, щойно користувач поділиться враженнями"
                        : "Тут з'являться коментарі користувача"
                }
            />
        </>
    );
};

export default UserComments;
