'use client';

import { FC, useState } from 'react';

import { useFormContext } from '@/components/form/form-context';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useFormContext() as any;
    const [newItem, setNewItem] = useState<string>();

    const isValidItem = newItem && newItem.trim() !== '';

    const addItem = () => {
        if (!isValidItem) return;
        const current =
            (form.getFieldValue(param.slug) as { value: string }[]) || [];
        form.setFieldValue(param.slug, [...current, { value: newItem }]);
        setNewItem('');
    };

    return (
        <div className="flex flex-col gap-6">
            <form.Field
                name={param.slug}
                mode="array"
                children={(field: any) => (
                    <div className="flex flex-wrap gap-2">
                        {(
                            (field.state.value as { value: string }[]) || []
                        ).map((item, index) => {
                            return (
                                <div
                                    className="border-border bg-secondary/20 flex items-center gap-2 rounded-md border px-2 py-1 text-sm"
                                    key={index}
                                >
                                    {item.value}
                                    {mode === 'edit' && (
                                        <Button
                                            onClick={() =>
                                                field.removeValue(index)
                                            }
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
                )}
            />
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
                                    addItem();
                                }
                            }}
                        />
                        <Button
                            disabled={!isValidItem}
                            onClick={addItem}
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
