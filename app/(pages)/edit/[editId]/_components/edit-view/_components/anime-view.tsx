'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { useEdit } from '@/app/(pages)/edit/page.hooks';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    ANIME_SYNOPSIS_PARAMS,
    ANIME_TITLE_PARAMS,
} from '@/utils/constants';

import InputParam from '../../../../_components/ui/input-param';
import ListParam from '../../../../_components/ui/list-param';
import EditDescription from '@/app/(pages)/edit/[editId]/_components/ui/edit-description';


const Component = () => {
    const params = useParams();
    const [editParams, setEditParams] = useState<
        (keyof Hikka.AnimeEditParams)[]
    >([]);

    const { data: edit } = useEdit<
        Hikka.Edit<Hikka.AnimeEditParams, Hikka.AnimeInfo>
    >(String(params.editId));

    useEffect(() => {
        if (edit) {
            setEditParams(
                Object.keys(edit.after) as (keyof Hikka.AnimeEditParams)[],
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
                    {(edit.after.title_ua ||
                        edit.after.title_en ||
                        edit.after.title_ja) && (
                        <InputParam
                            edit={edit}
                            title="Назва аніме"
                            selected={editParams}
                            params={ANIME_TITLE_PARAMS}
                            mode="view"
                        />
                    )}

                    {edit.after.synonyms && (
                        <ListParam
                            title="Синоніми"
                            selected={edit.after.synonyms}
                            mode="view"
                        />
                    )}

                    {(edit.after.synopsis_ua || edit.after.synopsis_en) && (
                        <InputParam
                            selected={editParams}
                            params={ANIME_SYNOPSIS_PARAMS}
                            title="Опис аніме"
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