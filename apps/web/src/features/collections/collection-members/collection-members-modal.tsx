import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import { ContentTypeEnum, type UserResponse } from '@hikka/api';

import MaterialSymbolsLogoutRounded from '@/components/icons/material-symbols/MaterialSymbolsLogoutRounded';
import MaterialSymbolsPersonAddRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddRounded';
import { Button } from '@/components/ui/button';
import HorizontalCardSkeleton from '@/components/ui/horizontal-card-skeleton';
import { useSession } from '@/features/auth/hooks/use-session';
import { SearchModal } from '@/features/search';
import type { SearchContent } from '@/features/search/search-modal/types';
import { COLLECTION_MEMBERS_LIMIT } from '@/utils/constants/collection-options';

import CollectionMemberItem from './components/collection-member-item';
import ConfirmDialog from './components/confirm-dialog';
import { useCollectionAccess } from './use-collection-access';
import { useCollectionMemberActions } from './use-collection-member-actions';
import { useCollectionMembers } from './use-collection-members';

type Props = {
    reference: string;
};

const CollectionMembersModal: FC<Props> = ({ reference }) => {
    const { user } = useSession();
    const [searchOpen, setSearchOpen] = useState(false);
    const [leaveOpen, setLeaveOpen] = useState(false);

    const { isOwner, isEditor, isPrivate } = useCollectionAccess(reference);
    const { accepted, pending, coauthorsCount, isLoading } =
        useCollectionMembers(reference);
    const actions = useCollectionMemberActions(reference);

    const isFull = coauthorsCount >= COLLECTION_MEMBERS_LIMIT;

    const handleInvite = (content: SearchContent | UserResponse) => {
        if (!('username' in content) || !content.username) return;

        actions.invite(content.username);
    };

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {isOwner && (
                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        size="md"
                        disabled={isFull}
                        onClick={() => setSearchOpen(true)}
                    >
                        <MaterialSymbolsPersonAddRounded />
                        Запросити співавтора
                    </Button>
                    <p className="text-muted-foreground text-xs">
                        {`Співавторів разом із запрошеннями: ${coauthorsCount} з ${COLLECTION_MEMBERS_LIMIT}. Запрошення діє 30 днів.`}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <h5>Учасники</h5>
                {isLoading &&
                    range(0, 3).map((index) => (
                        <HorizontalCardSkeleton key={index} imageRatio={1} />
                    ))}
                {accepted.map((member) => (
                    <CollectionMemberItem
                        key={member.user.reference}
                        member={member}
                        reference={reference}
                        canManage={isOwner}
                    />
                ))}
            </div>

            {isOwner && pending.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h5>Запрошення</h5>
                    {pending.map((member) => (
                        <CollectionMemberItem
                            key={member.user.reference}
                            member={member}
                            reference={reference}
                            canManage={isOwner}
                        />
                    ))}
                </div>
            )}

            {isOwner && (
                <p className="text-muted-foreground text-xs">
                    Власник не може вийти з колекції. Щоб піти, передайте
                    власність іншому співавтору або видаліть колекцію.
                </p>
            )}

            {isEditor && (
                <Button
                    variant="outline"
                    size="md"
                    onClick={() => setLeaveOpen(true)}
                    className="text-destructive-foreground"
                >
                    <MaterialSymbolsLogoutRounded />
                    Вийти з колекції
                </Button>
            )}

            <SearchModal
                open={searchOpen}
                onOpenChange={setSearchOpen}
                content_type={ContentTypeEnum.USER}
                onClick={handleInvite}
                type="button"
                disableHotkey
            />

            <ConfirmDialog
                open={leaveOpen}
                onOpenChange={setLeaveOpen}
                title="Вийти з колекції?"
                description={
                    isPrivate
                        ? 'Колекція приватна, тож Ви втратите доступ до неї, доки власник не запросить Вас знову.'
                        : 'Ви більше не зможете редагувати цю колекцію, доки власник не запросить Вас знову.'
                }
                confirmLabel="Вийти"
                onConfirm={() =>
                    actions.leave(user?.username, `/u/${user?.username}`)
                }
            />
        </div>
    );
};

export default CollectionMembersModal;
