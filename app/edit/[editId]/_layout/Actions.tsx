'use client';

import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import acceptEdit from '@/utils/api/edit/acceptEdit';
import closeEdit from '@/utils/api/edit/closeEdit';
import denyEdit from '@/utils/api/edit/denyEdit';

const Component = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { secret } = useAuthContext();

    const edit: Hikka.Edit | undefined = queryClient.getQueryData([
        'edit',
        params.editId,
    ]);

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const onAcceptSubmit = async () => {
        try {
            setIsSubmitting(true);
            await acceptEdit({
                secret: String(secret),
                edit_id: Number(edit?.edit_id),
            });
        } catch (e) {
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
    };

    const onCloseSubmit = async () => {
        try {
            setIsSubmitting(true);
            await closeEdit({
                secret: String(secret),
                edit_id: Number(edit?.edit_id),
            });
        } catch (e) {
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
    };

    const onDenySubmit = async () => {
        try {
            setIsSubmitting(true);
            await denyEdit({
                secret: String(secret),
                edit_id: Number(edit?.edit_id),
            });
        } catch (e) {
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
    };

    if (!edit) {
        return null;
    }

    return (
        <div className="grid grid-flow-col auto-cols-fr gap-2 items-center">
            {(loggedUser?.role === 'moderator' ||
                loggedUser?.role === 'admin') &&
            edit.status === 'pending' ? (
                <>
                    <button
                        disabled={isSubmitting}
                        className="btn btn-sm btn-success"
                        onClick={onAcceptSubmit}
                    >
                        Прийняти
                    </button>
                    <button
                        disabled={isSubmitting}
                        className="btn btn-sm btn-error"
                        onClick={onDenySubmit}
                    >
                        Відхилити
                    </button>
                </>
            ) : null}
            {loggedUser?.username === edit.author.username &&
                edit.status === 'pending' && (
                    <button
                        disabled={isSubmitting}
                        className="btn btn-sm btn-warning"
                        onClick={onCloseSubmit}
                    >
                        Закрити
                    </button>
                )}
        </div>
    );
};

export default Component;
