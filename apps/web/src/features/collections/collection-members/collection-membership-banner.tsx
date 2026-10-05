import { type FC, type ReactNode, useState } from 'react';

import {
    type CollectionMemberResponse,
    CollectionMemberRoleEnum,
    CollectionMemberStatusEnum,
} from '@hikka/api';

import MaterialSymbolsPersonAddRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddRounded';
import MaterialSymbolsShieldPerson from '@/components/icons/material-symbols/MaterialSymbolsShieldPerson';
import { Button } from '@/components/ui/button';

import ConfirmDialog from './components/confirm-dialog';
import { useCollectionMemberActions } from './use-collection-member-actions';
import { useCollectionMembers } from './use-collection-members';

type Props = {
    reference: string;
};

type BannerProps = Props & {
    me: CollectionMemberResponse;
};

type BannerShellProps = {
    icon: ReactNode;
    text: string;
    disabled: boolean;
    onDecline: () => void;
    onAccept: () => void;
    children: ReactNode;
};

const BannerShell: FC<BannerShellProps> = ({
    icon,
    text,
    disabled,
    onDecline,
    onAccept,
    children,
}) => (
    <>
        <div className="flex flex-col gap-4 rounded-md border border-border surface p-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-4">
                {icon}
                <span className="text-sm">{text}</span>
            </div>
            <div className="flex gap-2">
                <Button
                    size="md"
                    variant="outline"
                    disabled={disabled}
                    onClick={onDecline}
                >
                    Відхилити
                </Button>
                <Button size="md" disabled={disabled} onClick={onAccept}>
                    Прийняти
                </Button>
            </div>
        </div>
        {children}
    </>
);

// Declining is the step that can't be undone for a week, so it is confirmed
const InviteBanner: FC<BannerProps> = ({ reference, me }) => {
    const actions = useCollectionMemberActions(reference);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const inviter = me.invited_by?.username;

    return (
        <BannerShell
            icon={
                <MaterialSymbolsPersonAddRounded className="shrink-0 text-xl" />
            }
            text={
                inviter
                    ? `${inviter} запрошує Вас стати співавтором цієї колекції.`
                    : 'Вас запрошують стати співавтором цієї колекції.'
            }
            disabled={actions.isPending}
            onDecline={() => setConfirmOpen(true)}
            onAccept={actions.acceptInvite}
        >
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Відхилити запрошення?"
                description="Повторно запросити Вас до цієї колекції зможуть лише через 7 днів."
                confirmLabel="Відхилити"
                onConfirm={() => actions.leave(me.user.username, '/')}
            />
        </BannerShell>
    );
};

// Accepting is the step that binds, the new owner can't leave afterwards
const OwnershipOfferBanner: FC<BannerProps> = ({ reference }) => {
    const actions = useCollectionMemberActions(reference);
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <BannerShell
            icon={<MaterialSymbolsShieldPerson className="shrink-0 text-xl" />}
            text="Вам пропонують стати власником цієї колекції."
            disabled={actions.isPending}
            onDecline={actions.cancelOffer}
            onAccept={() => setConfirmOpen(true)}
        >
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Стати власником колекції?"
                description="Власник керує видимістю й учасниками та може видалити колекцію. Прийнявши, Ви не зможете вийти з неї, доки не передасте власність комусь іншому або не видалите колекцію."
                confirmLabel="Стати власником"
                onConfirm={actions.acceptOwnership}
            />
        </BannerShell>
    );
};

const CollectionMembershipBanner: FC<Props> = ({ reference }) => {
    const { me } = useCollectionMembers(reference);

    if (!me || me.role === CollectionMemberRoleEnum.OWNER) return null;

    if (me.status === CollectionMemberStatusEnum.PENDING) {
        return <InviteBanner reference={reference} me={me} />;
    }

    if (me.owner_offered_at !== null) {
        return <OwnershipOfferBanner reference={reference} me={me} />;
    }

    return null;
};

export default CollectionMembershipBanner;
