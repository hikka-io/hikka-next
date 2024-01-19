'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import getEdit from '@/utils/api/edit/getEdit';

type Param = {
    param: keyof Hikka.EditParams;
    title: string;
    placeholder: string;
};

const TITLE_PARAMS: Param[] = [
    {
        param: 'title_ua',
        title: 'Українською',
        placeholder: 'Введіть назву українською',
    },
    {
        param: 'title_en',
        title: 'Англійською',
        placeholder: 'Введіть назву англійською',
    },
    {
        param: 'title_ja',
        title: 'Японською',
        placeholder: 'Введіть назву японською',
    },
];

const SYNOPSIS_PARAMS: Param[] = [
    {
        param: 'synopsis_ua',
        title: 'Українською',
        placeholder: 'Введіть опис українською',
    },
    {
        param: 'synopsis_en',
        title: 'Англійською',
        placeholder: 'Введіть опис англійською',
    },
];

const Component = () => {
    const params = useParams();
    const [editParams, setEditParams] = useState<(keyof Hikka.EditParams)[]>(
        [],
    );

    const { data: edit } = useQuery({
        queryKey: ['edit', params.editId],
        queryFn: () => getEdit({ edit_id: Number(params.editId) }),
    });

    useEffect(() => {
        if (edit) {
            setEditParams(
                Object.keys(edit.after) as (keyof Hikka.EditParams)[],
            );
        }
    }, [edit]);

    if (!edit) {
        return null;
    }

    return (
        <div>
            <div className="flex flex-col gap-6">
                <div className="flex w-full flex-col gap-2">
                    {(edit.after.title_ua ||
                        edit.after.title_en ||
                        edit.after.title_ja) && (
                        <div className="collapse border border-secondary">
                            <input type="checkbox" checked readOnly />
                            <div className="collapse-title flex items-center gap-4">
                                <h5>Назва аніме</h5>
                            </div>
                            <div className="collapse-content flex flex-col gap-2">
                                {editParams.map((eParam) => {
                                    const param = TITLE_PARAMS.find(
                                        (tParam) => tParam.param === eParam,
                                    );

                                    if (!param) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={param.param}
                                            className="form-control w-full"
                                        >
                                            <label className="label">
                                                <span className="label-text">
                                                    {param.title}
                                                </span>
                                            </label>
                                            <input
                                                disabled
                                                type="text"
                                                placeholder={param.placeholder}
                                                className="input w-full bg-secondary/60 disabled:bg-secondary/60 disabled:text-secondary-content"
                                                value={edit!.after[param.param]}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {(edit.after.synopsis_ua || edit.after.synopsis_en) && (
                        <div className="collapse border border-secondary">
                            <input type="checkbox" checked readOnly />
                            <div className="collapse-title flex items-center gap-4">
                                <h5>Опис аніме</h5>
                            </div>
                            <div className="collapse-content flex flex-col gap-2">
                                {editParams.map((eParam) => {
                                    const param = SYNOPSIS_PARAMS.find(
                                        (tParam) => tParam.param === eParam,
                                    );

                                    if (!param) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={param.param}
                                            className="form-control w-full"
                                        >
                                            <label className="label">
                                                <span className="label-text">
                                                    {param.title}
                                                </span>
                                            </label>
                                            <textarea
                                                disabled
                                                placeholder={param.placeholder}
                                                rows={5}
                                                className="textarea textarea-ghost w-full bg-secondary/60 text-base disabled:bg-secondary/60 disabled:text-secondary-content"
                                                value={edit!.after[param.param]}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {edit.description && (
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Опис правки</span>
                            </label>
                            <textarea
                                disabled
                                placeholder="Введіть причину правки"
                                rows={3}
                                className="textarea textarea-ghost w-full bg-secondary/60 text-base disabled:bg-secondary/60 disabled:text-secondary-content"
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
