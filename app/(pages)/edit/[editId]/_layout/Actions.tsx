'use client';

import * as React from 'react';
import { useState } from 'react';

import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import acceptEdit from '@/utils/api/edit/acceptEdit';
import closeEdit from '@/utils/api/edit/closeEdit';
import denyEdit from '@/utils/api/edit/denyEdit';
import { useAuthContext } from '@/utils/providers/AuthProvider';


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

    if (edit?.status !== 'pending') {
        return null;
    }

    if (!edit.author) {
        return null;
    }

    if (
        !(loggedUser?.role === 'moderator' || loggedUser?.role === 'admin') &&
        edit.author.username !== loggedUser?.username &&
        !edit
    ) {
        return null;
    }

    return (
        <div className="grid auto-cols-min grid-flow-col items-center gap-2">
            {(loggedUser?.role === 'moderator' ||
                loggedUser?.role === 'admin') &&
            edit.status === 'pending' ? (
                <>
                    <button
                        disabled={isSubmitting}
                        className="btn btn-success btn-sm"
                        onClick={onAcceptSubmit}
                    >
                        Прийняти
                    </button>
                    <button
                        disabled={isSubmitting}
                        className="btn btn-error btn-sm"
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
                        className="btn btn-warning btn-sm"
                        onClick={onCloseSubmit}
                    >
                        Закрити
                    </button>
                )}
        </div>
    );
};

export default Component;