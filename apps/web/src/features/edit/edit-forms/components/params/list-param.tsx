'use client';

import { FC, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import MaterialSymbolsCloseSmallRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseSmallRounded';
import MaterialSymbolsAddRounded from '@/components/icons/watch-status/planned';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    param: Hikka.EditParam;
    mode: 'edit' | 'view';
}

const ListParam: FC<Props> = ({ param, mode }) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: param.slug,
        // defaultValue: value ? value.split(',').map((value) => { value }) : [],
    });

    const [newItem, setNewItem] = useState<string>();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
                {fields.map((item: Record<any, string>, index) => {
                    return (
                        <div
                            className="flex items-center gap-2 rounded-md border border-border bg-secondary/20 px-2 py-1 text-sm"
                            key={item.id}
                        >
                            {item.value}
                            {mode === 'edit' && (
                                <Button
                                    onClick={() => remove(index)}
                                    variant="ghost"
                                    size="icon-xs"
                                >
                                    <MaterialSymbolsCloseSmallRounded />
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
            {mode === 'edit' && (
                <div className="flex w-full flex-col gap-4">
                    <Label>{param.title}</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (
                                        newItem &&
                                        newItem.length !== 0 &&
                                        newItem.trim() !== ''
                                    ) {
                                        append({ value: newItem });
                                        setNewItem('');
                                    }
                                }
                            }}
                        />
                        <Button
                            disabled={
                                !newItem ||
                                newItem?.length === 0 ||
                                newItem.trim() === ''
                            }
                            onClick={() => {
                                append({ value: newItem });
                                setNewItem('');
                            }}
                            size="icon"
                            variant="secondary"
                        >
                            <MaterialSymbolsAddRounded />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListParam;
