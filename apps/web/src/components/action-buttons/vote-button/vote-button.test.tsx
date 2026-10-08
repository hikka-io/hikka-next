import type { ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum, VoteContentTypeEnum } from '@hikka/api';

import { buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';

import VoteButton from './vote-button';

vi.mock('./use-vote', () => ({
    useVote: ({
        myScore,
        voteScore,
    }: {
        myScore: number;
        voteScore: number;
    }) => ({
        currentMyScore: myScore,
        optimisticVoteScore: voteScore,
        handleVote: () => {},
    }),
}));

type VoteProps = Omit<ComponentProps<typeof VoteButton>, 'variant'>;

const LegacyNavbarVote = (props: VoteProps) => (
    <Card
        className={buttonVariants({
            variant: 'secondary',
            size: 'md',
            className: 'flex-row gap-0 overflow-hidden border-none p-0',
        })}
    >
        <VoteButton {...props} />
    </Card>
);

describe('VoteButton card variant', () => {
    it.each([
        {
            contentType: VoteContentTypeEnum.ARTICLE,
            slug: 'article-slug',
            myScore: 1,
            voteScore: 5,
        },
        {
            contentType: ContentTypeEnum.COLLECTION,
            slug: 'collection-reference',
            myScore: -1,
            voteScore: -2,
        },
    ] satisfies VoteProps[])(
        'matches the $contentType navbar vote',
        (props) => {
            expect(
                renderToStaticMarkup(<VoteButton variant="card" {...props} />),
            ).toBe(renderToStaticMarkup(<LegacyNavbarVote {...props} />));
        },
    );
});
