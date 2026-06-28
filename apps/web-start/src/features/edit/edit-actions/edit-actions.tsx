import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getEditOptions } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/hooks/use-session';
import { Link, useParams } from '@/utils/navigation';

import AcceptAction from './accept-action';
import CloseAction from './close-action';
import DenyAction from './deny-action';

type Props = {
    editId: string;
};

const EditActions: FC<Props> = ({ editId }) => {
    const { data: edit } = useQuery(
        getEditOptions({ path: { edit_id: Number(editId) } }),
    );
    const params = useParams();

    const { user: loggedUser } = useSession();

    if (edit?.status !== 'pending') {
        return null;
    }

    const isAuthor = loggedUser?.username === edit.author?.username;
    const isModeratorOrAdmin = ['moderator', 'admin'].includes(
        loggedUser?.role ?? '',
    );

    const showDenyAndAccept = isModeratorOrAdmin;
    const showCloseAndEdit = isAuthor || isModeratorOrAdmin;

    return (
        <div className="flex items-center justify-between gap-2">
            {showCloseAndEdit && (
                <div className="flex items-center gap-2">
                    {isAuthor && <CloseAction />}
                    <Button variant="secondary" size="md" asChild>
                        <Link to={`/edit/${params.editId}/update`}>
                            Редагувати
                        </Link>
                    </Button>
                </div>
            )}

            {showDenyAndAccept && (
                <div className="flex items-center gap-2">
                    <DenyAction />
                    <AcceptAction edit={edit} />
                </div>
            )}
        </div>
    );
};

export default EditActions;
