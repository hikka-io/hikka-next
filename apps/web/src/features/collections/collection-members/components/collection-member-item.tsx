import { type FC, useState } from 'react';

import {
    type CollectionMemberResponse,
    CollectionMemberRoleEnum,
    CollectionMemberStatusEnum,
} from '@hikka/api';

import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import MaterialSymbolsPersonRemoveOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonRemoveOutlineRounded';
import MaterialSymbolsShieldPerson from '@/components/icons/material-symbols/MaterialSymbolsShieldPerson';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { useCollectionAccess } from '../use-collection-access';
import { useCollectionMemberActions } from '../use-collection-member-actions';
import ConfirmDialog from './confirm-dialog';

type Action = 'remove' | 'offer' | 'cancel-offer';

type Props = {
    member: CollectionMemberResponse;
    reference: string;
    canManage: boolean;
};

const CollectionMemberItem: FC<Props> = ({ member, reference, canManage }) => {
    const { isPrivate } = useCollectionAccess(reference);
    const actions = useCollectionMemberActions(reference);
    const [action, setAction] = useState<Action>('remove');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const openConfirm = (next: Action) => {
        setAction(next);
        setConfirmOpen(true);
    };

    const username = member.user.username ?? '';
    const isOwner = member.role === CollectionMemberRoleEnum.OWNER;
    const isPending = member.status === CollectionMemberStatusEnum.PENDING;
    const isOffered = member.owner_offered_at !== null;

    const confirm = {
        remove: {
            title: isPending
                ? `Скасувати запрошення для ${username}?`
                : `Прибрати ${username} зі співавторів?`,
            description: isPending
                ? 'Запрошення зникне, і користувач не зможе його прийняти.'
                : isPrivate
                  ? 'Колекція приватна, тож користувач втратить доступ до неї.'
                  : 'Користувач більше не зможе редагувати колекцію.',
            run: () => actions.remove(username),
        },
        offer: {
            title: `Передати власність ${username}?`,
            description:
                'Користувач отримає заявку і має її прийняти. До того Ви лишаєтесь власником, а заявку можна скасувати. Заявка діє 30 днів.',
            run: () => actions.offerOwnership(username),
        },
        'cancel-offer': {
            title: 'Скасувати передачу власності?',
            description: `${username} більше не зможе прийняти заявку.`,
            run: actions.cancelOffer,
        },
    };

    return (
        <HorizontalCard>
            <HorizontalCardImage
                image={member.user.avatar}
                imageRatio={1}
                href={`/u/${username}`}
            />
            <HorizontalCardContainer className="gap-1">
                <div className="flex flex-wrap items-center gap-2">
                    <HorizontalCardTitle href={`/u/${username}`}>
                        {username}
                    </HorizontalCardTitle>
                    {isOwner && <Badge variant="secondary">Власник</Badge>}
                    {isPending && <Badge variant="warning">Запрошено</Badge>}
                    {isOffered && (
                        <Badge variant="warning">Запропоновано власність</Badge>
                    )}
                </div>
                {member.invited_by && !isOwner && (
                    <HorizontalCardDescription>
                        {`Запросив ${member.invited_by.username}`}
                    </HorizontalCardDescription>
                )}
            </HorizontalCardContainer>
            {canManage && !isOwner && (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon-md"
                                className="text-muted-foreground [&_svg]:size-5"
                                aria-label="Дії з учасником"
                            />
                        }
                    >
                        <MaterialSymbolsMoreHoriz />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {!isPending && !isOffered && (
                            <DropdownMenuItem
                                onClick={() => openConfirm('offer')}
                            >
                                <MaterialSymbolsShieldPerson />
                                Передати власність
                            </DropdownMenuItem>
                        )}
                        {isOffered && (
                            <DropdownMenuItem
                                onClick={() => openConfirm('cancel-offer')}
                            >
                                <MaterialSymbolsShieldPerson />
                                Скасувати передачу
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={() => openConfirm('remove')}
                            className="text-destructive-foreground"
                        >
                            <MaterialSymbolsPersonRemoveOutlineRounded />
                            {isPending ? 'Скасувати запрошення' : 'Прибрати'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={confirm[action].title}
                description={confirm[action].description}
                confirmLabel="Підтвердити"
                onConfirm={confirm[action].run}
            />
        </HorizontalCard>
    );
};

export default CollectionMemberItem;
