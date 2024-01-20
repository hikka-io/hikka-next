'use client';

import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/app/_components/ui/collapsible';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Textarea } from '@/app/_components/ui/textarea';
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
                <div className="flex w-full flex-col gap-6">
                    {(edit.after.title_ua ||
                        edit.after.title_en ||
                        edit.after.title_ja) && (
                        <Collapsible
                            open
                            className="w-full space-y-2 border border-accent rounded-lg p-4"
                        >
                            <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-between">
                                    <h5>Назва аніме</h5>
                                    <Button
                                        disabled
                                        id="title-collapse"
                                        variant="ghost"
                                        size="sm"
                                        className="w-9 p-0"
                                    >
                                        <ChevronsUpDown className="h-4 w-4" />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="flex flex-col gap-6">
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
                                            className="flex flex-col gap-4 w-full"
                                        >
                                            <Label>{param.title}</Label>
                                            <Input
                                                disabled
                                                type="text"
                                                placeholder={param.placeholder}
                                                className="w-full disabled:opacity-100"
                                                value={edit!.after[param.param]}
                                            />
                                        </div>
                                    );
                                })}
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {edit.after.synonyms && (
                        <Collapsible className="w-full space-y-2 border border-accent rounded-lg p-4">
                            <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-between">
                                    <h5>Синоніми</h5>
                                    <Button
                                        id="title-collapse"
                                        variant="ghost"
                                        size="sm"
                                        className="w-9 p-0"
                                    >
                                        <ChevronsUpDown className="h-4 w-4" />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="flex flex-col gap-6">
                                <div className="flex gap-2 flex-wrap">
                                    {edit.after.synonyms.map((synonym) => {
                                        return (
                                            <div
                                                className="flex gap-2 items-center px-2 py-1 border border-secondary/30 text-sm rounded-md bg-secondary/30"
                                                key={synonym}
                                            >
                                                {synonym}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {(edit.after.synopsis_ua || edit.after.synopsis_en) && (
                        <Collapsible
                            open
                            className="w-full space-y-2 border border-accent  rounded-lg p-4"
                        >
                            <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-between">
                                    <h5>Опис аніме</h5>
                                    <Button
                                        disabled
                                        id="title-collapse"
                                        variant="ghost"
                                        size="sm"
                                        className="w-9 p-0"
                                    >
                                        <ChevronsUpDown className="h-4 w-4" />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="flex flex-col gap-6">
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
                                            className="flex flex-col gap-4 w-full"
                                        >
                                            <Label>{param.title}</Label>
                                            <Textarea
                                                disabled
                                                placeholder={param.placeholder}
                                                rows={5}
                                                className="w-full disabled:opacity-100"
                                                value={edit!.after[param.param]}
                                            />
                                        </div>
                                    );
                                })}
                            </CollapsibleContent>
                        </Collapsible>
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