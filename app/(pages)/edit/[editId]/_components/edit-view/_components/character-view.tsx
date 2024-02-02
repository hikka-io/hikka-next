'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { Label } from '@/app/_components/ui/label';
import { Textarea } from '@/app/_components/ui/textarea';
import getEdit from '@/app/_utils/api/edit/getEdit';
import {
    CHARACTER_DESCRIPTION_PARAMS,
    CHARACTER_TITLE_PARAMS,
} from '@/app/_utils/constants';

import InputParam from '../../../../_components/ui/input-param';


const Component = () => {
    const params = useParams();
    const [editParams, setEditParams] = useState<
        (keyof Hikka.CharacterEditParams)[]
    >([]);

    const { data: edit } = useQuery<
        Hikka.Edit<Hikka.CharacterEditParams, Hikka.Character>,
        Error
    >({
        queryKey: ['edit', params.editId],
        queryFn: () => getEdit({ edit_id: Number(params.editId) }),
    });

    useEffect(() => {
        if (edit) {
            setEditParams(
                Object.keys(edit.after) as (keyof Hikka.CharacterEditParams)[],
            );
        }
    }, [edit]);

    if (!edit) {
        return null;
    }

    return (
        <div>
            <div className="flex flex-col gap-6">
                <div className="flex w-full flex-col gap-6">
                    {(edit.after.name_ua ||
                        edit.after.name_en ||
                        edit.after.name_ja) && (
                        <InputParam
                            edit={edit}
                            title="Імʼя персонажа"
                            selected={editParams}
                            params={CHARACTER_TITLE_PARAMS}
                            mode="view"
                        />
                    )}

                    {edit.after.description_ua && (
                        <InputParam
                            selected={editParams}
                            params={CHARACTER_DESCRIPTION_PARAMS}
                            title="Опис персонажа"
                            mode="view"
                            editor="markdown"
                            edit={edit}
                        />
                    )}

                    {edit.description && (
                        <div className="flex flex-col gap-4 w-full">
                            <Label>Опис правки</Label>
                            <Textarea
                                disabled
                                placeholder="Введіть причину правки"
                                rows={3}
                                className="w-full disabled:opacity-100"
                                value={edit!.description}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Component;