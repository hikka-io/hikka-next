'use client';

import * as React from 'react';
import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import acceptEdit from '@/services/api/edit/acceptEdit';
import closeEdit from '@/services/api/edit/closeEdit';
import denyEdit from '@/services/api/edit/denyEdit';
import useEdit from '@/services/hooks/edit/useEdit';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';
import { useAuthContext } from '@/services/providers/auth-provider';

interface Props {
    editId: string;
}

const Component = ({ editId }: Props) => {
    const { data: edit } = useEdit({ editId: Number(editId) });
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { secret } = useAuthContext();

    const { data: loggedUser } = useLoggedUser();

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
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                {loggedUser?.username === edit.author.username &&
                    edit.status === 'pending' && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={onCloseSubmit}
                        >
                            Закрити
                        </Button>
                    )}
                {(loggedUser?.role === 'moderator' ||
                    loggedUser?.role === 'admin' ||
                    loggedUser?.username === edit.author.username) &&
                    edit.status === 'pending' && (
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={isSubmitting}
                            asChild
                        >
                            <Link href={`/edit/${params.editId}/update`}>
                                Редагувати
                            </Link>
                        </Button>
                    )}
            </div>

            {(loggedUser?.role === 'moderator' ||
                loggedUser?.role === 'admin') &&
            edit.status === 'pending' ? (
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={onDenySubmit}
                    >
                        Відхилити
                    </Button>

                    <Button
                        variant="success"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={onAcceptSubmit}
                    >
                        Прийняти
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

export default Component;
