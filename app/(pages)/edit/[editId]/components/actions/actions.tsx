'use client';

import * as React from 'react';
import { FC } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import useSession from '@/services/hooks/auth/useSession';
import useEdit from '@/services/hooks/edit/useEdit';

import AcceptAction from './components/accept-action';
import CloseAction from './components/close-action';
import DenyAction from './components/deny-action';

interface Props {
    editId: string;
}

const Actions: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ editId: Number(editId) });
    const params = useParams();

    const { user: loggedUser } = useSession();

    const isPending = edit?.status === 'pending';
    const isAuthor = loggedUser?.username === edit?.author?.username;
    const isModeratorOrAdmin = loggedUser && ['moderator', 'admin'].includes(loggedUser?.role);

    if (!isPending) {
        return null;
    }

    const showDenyAndAccept = isModeratorOrAdmin && isPending;
    const showCloseAndEdit = (isAuthor || isModeratorOrAdmin) && isPending;

    return (
        <div className="flex items-center justify-between gap-2">
            {showCloseAndEdit && (
                <div className="flex items-center gap-2">
                    {isAuthor && <CloseAction />}
                    <Button variant="secondary" size="sm" asChild>
                        <Link href={`/edit/${params.editId}/update`}>
                            Редагувати
                        </Link>
                    </Button>
                </div>
            )}

            {showDenyAndAccept && (
                <div className="flex items-center gap-2">
                    <DenyAction />
                    <AcceptAction />
                </div>
            )}
        </div>
    );
};

export default Actions;