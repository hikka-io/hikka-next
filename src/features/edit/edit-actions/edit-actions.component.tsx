'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import useSession from '@/services/hooks/auth/use-session';
import useEdit from '@/services/hooks/edit/use-edit';

import AcceptAction from './accept-action';
import CloseAction from './close-action';
import DenyAction from './deny-action';

interface Props {
    editId: string;
}

const EditActions: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ edit_id: Number(editId) });
    const params = useParams();

    const { user: loggedUser } = useSession();

    const isPending = edit?.status === 'pending';
    const isAuthor = loggedUser?.username === edit?.author?.username;
    const isModeratorOrAdmin =
        loggedUser && ['moderator', 'admin'].includes(loggedUser?.role);

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

export default EditActions;
