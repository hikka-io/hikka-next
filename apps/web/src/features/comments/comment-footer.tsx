import type { FC } from 'react';

import { Reply } from 'lucide-react';

import type { CommentResponse } from '@hikka/api';

import { StatItem, StatItemGroup } from '@/components/ui/stat-item';

import CommentVote from './comment-vote';

type Props = {
    comment: CommentResponse;
    onReply: () => void;
    canReply: boolean;
};

const CommentFooter: FC<Props> = ({ comment, onReply, canReply }) => {
    if (comment.hidden) return null;

    return (
        <StatItemGroup>
            <CommentVote comment={comment} />
            <StatItem
                onClick={onReply}
                disabled={!canReply}
                className="disabled:pointer-events-none disabled:opacity-50"
            >
                <Reply />
                Відповісти
            </StatItem>
        </StatItemGroup>
    );
};

export default CommentFooter;
