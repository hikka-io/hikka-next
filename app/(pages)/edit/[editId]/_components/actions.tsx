'use client';

import * as React from 'react';
import { useState } from 'react';

import { useParams } from 'next/navigation';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import acceptEdit from '@/app/_utils/api/edit/acceptEdit';
import closeEdit from '@/app/_utils/api/edit/closeEdit';
import denyEdit from '@/app/_utils/api/edit/denyEdit';
import getEdit from '@/app/_utils/api/edit/getEdit';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';


const Component = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { secret } = useAuthContext();

    const { data: edit } = useQuery({
        queryKey: ['edit', params.editId],
        queryFn: () => getEdit({ edit_id: Number(params.editId) }),
    });

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
            await queryClient.invalidateQueries({
                queryKey: ['edit', params.editId],
            });
            // router.refresh();
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
            await queryClient.invalidateQueries({
                queryKey: ['edit', params.editId],
            });
            // router.refresh();
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
            await queryClient.invalidateQueries({
                queryKey: ['edit', params.editId],
            });
            // router.refresh();
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
                    <Button
                        variant="success"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={onAcceptSubmit}
                    >
                        Прийняти
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={onDenySubmit}
                    >
                        Відхилити
                    </Button>
                </>
            ) : null}
            {loggedUser?.username === edit.author.username &&
                edit.status === 'pending' && (
                    <Button
                        variant="warning"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={onCloseSubmit}
                    >
                        Закрити
                    </Button>
                )}
        </div>
    );
};

export default Component;