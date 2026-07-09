import type { FC, PropsWithChildren, ReactNode } from 'react';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { type EditStatusEnum, getEditOptions } from '@hikka/api';

import MaterialSymbolsHourglassEmptyRounded from '@/components/icons/material-symbols/MaterialSymbolsHourglassEmptyRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Link } from '@/utils/navigation';

import EditStatusBadge from './edit-status';

type Props = {
    editId: string;
};

const MOD_VERB: Record<EditStatusEnum, string> = {
    accepted: 'Прийняв правку',
    denied: 'Відхилив правку',
    closed: 'Закрив правку',
    pending: '',
};

const NodeMeta: FC<{ action: string; date: number }> = ({ action, date }) => (
    <div className="flex flex-wrap items-center gap-x-2 text-muted-foreground text-xs">
        <span>{action}</span>
        <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
        <span>{format(date * 1000, 'd MMM yyyy')}</span>
    </div>
);

const Username: FC<{ username: string | null }> = ({ username }) => (
    <Link
        to={`/u/${username}`}
        className="truncate font-medium text-sm hover:underline"
    >
        {username}
    </Link>
);

const UserAvatar: FC<{ username: string | null; avatar: string | null }> = ({
    username,
    avatar,
}) => (
    <Link to={`/u/${username}`}>
        <Avatar className="size-12 rounded-lg">
            <AvatarImage src={avatar ?? undefined} />
            <AvatarFallback className="rounded-lg text-sm">
                {username?.[0]?.toUpperCase() ?? '?'}
            </AvatarFallback>
        </Avatar>
    </Link>
);

const PendingDisc: FC = () => (
    <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <MaterialSymbolsHourglassEmptyRounded className="size-5" />
    </div>
);

const TimelineNode: FC<
    PropsWithChildren<{
        label: string;
        media: ReactNode;
        showConnector: boolean;
    }>
> = ({ label, media, showConnector, children }) => (
    <div className="flex gap-4">
        <div className="relative isolate w-12 shrink-0">
            <div className="relative z-10">{media}</div>
            {showConnector && (
                <span className="absolute top-12 -bottom-6 left-1/2 w-px -translate-x-1/2 bg-border" />
            )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="text-muted-foreground text-xs">{label}</span>
            {children}
        </div>
    </div>
);

const EditTimeline: FC<Props> = ({ editId }) => {
    const { data: edit } = useQuery(
        getEditOptions({ path: { edit_id: Number(editId) } }),
    );

    if (!edit) {
        return null;
    }

    const { author, moderator, status, created, updated } = edit;

    const isPending = status === 'pending';
    const hasSecondNode = Boolean(moderator) || isPending;

    return (
        <Card className="p-0">
            <Block className="py-4">
                <Header className="px-4">
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Деталі</HeaderTitle>
                    </HeaderContainer>
                    <EditStatusBadge editId={editId} />
                </Header>
                <div className="flex flex-col gap-6 px-4">
                    {author && (
                        <TimelineNode
                            label="Автор"
                            showConnector={hasSecondNode}
                            media={
                                <UserAvatar
                                    username={author.username}
                                    avatar={author.avatar}
                                />
                            }
                        >
                            <Username username={author.username} />
                            <NodeMeta action="Створив правку" date={created} />
                        </TimelineNode>
                    )}
                    {moderator ? (
                        <TimelineNode
                            label="Модератор"
                            showConnector={false}
                            media={
                                <UserAvatar
                                    username={moderator.username}
                                    avatar={moderator.avatar}
                                />
                            }
                        >
                            <Username username={moderator.username} />
                            <NodeMeta
                                action={MOD_VERB[status] || 'Опрацював правку'}
                                date={updated}
                            />
                        </TimelineNode>
                    ) : (
                        isPending && (
                            <TimelineNode
                                label="Модератор"
                                showConnector={false}
                                media={<PendingDisc />}
                            >
                                <span className="text-muted-foreground text-sm">
                                    Очікує на розгляд
                                </span>
                            </TimelineNode>
                        )
                    )}
                </div>
            </Block>
        </Card>
    );
};

export default EditTimeline;
