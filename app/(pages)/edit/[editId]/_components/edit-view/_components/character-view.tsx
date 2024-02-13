'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import EditDescription from '@/app/(pages)/edit/[editId]/_components/ui/edit-description';
import { useEdit } from '@/app/(pages)/edit/page.hooks';
import {
    CHARACTER_DESCRIPTION_PARAMS,
    CHARACTER_TITLE_PARAMS,
} from '@/utils/constants';

import InputParam from '../../../../_components/ui/input-param';


const Component = () => {
    const params = useParams();
    const [editParams, setEditParams] = useState<
        (keyof Hikka.CharacterEditParams)[]
    >([]);

    const { data: edit } = useEdit<
        Hikka.Edit<Hikka.CharacterEditParams, Hikka.Character>
    >(String(params.editId));

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
                        <EditDescription
                            disabled
                            className="w-full disabled:opacity-100"
                            value={edit!.description}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Component;
