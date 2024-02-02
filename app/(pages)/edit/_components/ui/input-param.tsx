'use client';

import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Controller } from 'react-hook-form';

import MDEditor from '@/app/_components/markdown/editor/MD-editor';
import MDViewer from '@/app/_components/markdown/viewer/MD-viewer';
import { Button } from '@/app/_components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/app/_components/ui/collapsible';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';

interface EditProps<
    TEditParams extends Hikka.AnimeEditParams | Hikka.CharacterEditParams,
> {
    title: string;
    selected: (keyof TEditParams)[];
    params: Hikka.EditParam<TEditParams>[];
    content: Record<string, any>;
    onSwitchParam: (param: keyof TEditParams) => void;
    register: any;
    control?: any;
    editor?: 'input' | 'markdown';
    mode: 'edit';
    edit?: Hikka.Edit<TEditParams>;
}

interface ViewProps<
    TEditParams extends Hikka.AnimeEditParams | Hikka.CharacterEditParams,
> {
    title: string;
    selected: (keyof TEditParams)[];
    params: Hikka.EditParam<TEditParams>[];
    editor?: 'input' | 'markdown';
    mode: 'view';
    edit: Hikka.Edit<TEditParams>;
    content?: Record<string, any>;
    onSwitchParam?: (param: keyof TEditParams) => void;
    register?: any;
    control?: any;
}

const Component = <
    TEditParams extends Hikka.AnimeEditParams | Hikka.CharacterEditParams,
>({
    mode,
    title,
    content,
    params,
    selected,
    register,
    onSwitchParam,
    editor,
    control,
    edit,
}: EditProps<TEditParams> | ViewProps<TEditParams>) => {
    return (
        <Collapsible className="w-full space-y-2 border border-accent rounded-lg p-4">
            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between">
                    <h5>{title}</h5>
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
                {mode === 'edit' && (
                    <div className="flex flex-wrap gap-2">
                        {params.map((param) => (
                            <Button
                                size="badge"
                                variant={
                                    selected.includes(param.param)
                                        ? 'default'
                                        : 'outline'
                                }
                                key={param.param as string}
                                onClick={() => onSwitchParam(param.param)}
                            >
                                {param.title}
                            </Button>
                        ))}
                    </div>
                )}
                {selected.map((eParam) => {
                    const param = params.find(
                        (tParam) => tParam.param === eParam,
                    );

                    if (!param) {
                        return null;
                    }

                    return (
                        <div
                            key={param.param as string}
                            className="flex flex-col gap-4 w-full"
                        >
                            <Label>{param.title}</Label>
                            {editor !== 'markdown' ? (
                                <Input
                                    disabled={mode === 'view'}
                                    type="text"
                                    placeholder={param.placeholder}
                                    className="w-full disabled:text-secondary-foreground"
                                    {...(mode === 'edit'
                                        ? register(param.param, {
                                              value:
                                                  (content![
                                                      param.param as string
                                                  ] as string) || undefined,
                                          })
                                        : { value: edit!.after[param.param] })}
                                />
                            ) : mode === 'edit' ? (
                                <Controller
                                    control={control}
                                    name={param.param as string}
                                    render={({
                                        field: { onChange, onBlur, ref },
                                    }) => (
                                        <MDEditor
                                            ref={ref}
                                            placeholder={param.placeholder}
                                            className="dark-theme dark-editor bg-secondary/30 border-secondary/60 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                                            markdown={
                                                (content![
                                                    param.param as string
                                                ] as string) || ''
                                            }
                                            onChange={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                />
                            ) : (
                                <MDViewer className="bg-secondary/30 border-secondary/60 border rounded-md p-4 markdown text-sm">
                                    {String(edit!.after[param.param])}
                                </MDViewer>
                            )}
                        </div>
                    );
                })}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Component;