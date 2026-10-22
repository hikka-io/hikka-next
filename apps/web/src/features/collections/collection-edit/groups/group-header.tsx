import type { FC } from 'react';

import { Header } from '@/components/ui/header';

import { useCollectionContext } from '../collection-provider';
import { type GroupTitleIssue, groupTitleIssues } from '../collection-rules';
import GroupMenu from './group-menu';

const ISSUE_TEXT: Record<GroupTitleIssue, string> = {
    empty: 'Вкажіть назву групи',
    duplicate: 'Група з такою назвою вже є',
};

type Props = {
    groupId: string;
};

/** The group's name typed in place of its heading, with its title count. */
const GroupHeader: FC<Props> = ({ groupId }) => {
    const title = useCollectionContext(
        (state) => state.groups.find((group) => group.id === groupId)?.title,
    );
    const count = useCollectionContext(
        (state) =>
            state.groups.find((group) => group.id === groupId)?.items.length ??
            0,
    );
    const issue = useCollectionContext((state) =>
        groupTitleIssues(state.groups).get(groupId),
    );
    const updateGroupTitle = useCollectionContext(
        (state) => state.updateGroupTitle,
    );

    return (
        <div className="flex flex-col gap-1">
            <Header className="gap-1.5">
                <input
                    aria-label="Назва групи"
                    placeholder="Назва групи"
                    value={title ?? ''}
                    aria-invalid={issue !== undefined}
                    onChange={(e) => updateGroupTitle(groupId, e.target.value)}
                    className="field-sizing-content min-w-[2ch] max-w-full bg-transparent font-semibold text-base leading-6 outline-none placeholder:text-muted-foreground/60"
                />
                <span className="shrink-0 font-medium text-base text-muted-foreground tabular-nums">
                    {count}
                </span>
                <GroupMenu groupId={groupId} className="-mr-2 ml-auto" />
            </Header>
            {issue && (
                <p className="text-destructive-foreground text-xs">
                    {ISSUE_TEXT[issue]}
                </p>
            )}
        </div>
    );
};

export default GroupHeader;
