import { type FC, useState } from 'react';

import { useFormContext } from '@/components/form/form-context';
import MaterialSymbolsCloseSmallRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseSmallRounded';
import MaterialSymbolsAddRounded from '@/components/icons/watch-status/planned';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

type Props = {
    param: Hikka.EditParam;
    mode: 'edit' | 'view';
};

const ListParam: FC<Props> = ({ param, mode }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useFormContext() as any;
    const [newItem, setNewItem] = useState('');

    const trimmed = newItem.trim();

    const addItem = () => {
        if (!trimmed) return;
        const current =
            (form.getFieldValue(param.slug) as { value: string }[]) || [];
        const exists = current.some(
            (item) => item.value.toLowerCase() === trimmed.toLowerCase(),
        );
        if (!exists) {
            form.setFieldValue(param.slug, [...current, { value: trimmed }]);
        }
        setNewItem('');
    };

    return (
        <div className="flex flex-col gap-4">
            <form.Field
                name={param.slug}
                mode="array"
                children={(field: any) => {
                    const items =
                        (field.state.value as { value: string }[]) || [];

                    if (items.length === 0) {
                        return mode === 'view' ? (
                            <p className="text-muted-foreground text-sm">
                                Не вказано
                            </p>
                        ) : null;
                    }

                    return (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item, index) => (
                                <div
                                    className={cn(
                                        'surface-inset flex items-center gap-1 rounded-md border border-border py-1 text-sm',
                                        mode === 'edit'
                                            ? 'pr-1 pl-2.5'
                                            : 'px-2.5',
                                    )}
                                    key={item.value}
                                >
                                    {item.value}
                                    {mode === 'edit' && (
                                        <Button
                                            onClick={() =>
                                                field.removeValue(index)
                                            }
                                            variant="ghost"
                                            size="icon-xs"
                                            className="text-muted-foreground hover:text-destructive"
                                            aria-label={`Видалити «${item.value}»`}
                                        >
                                            <MaterialSymbolsCloseSmallRounded />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                }}
            />
            {mode === 'edit' && (
                <div className="flex w-full flex-col gap-4">
                    <Label className="text-muted-foreground">
                        {param.title}
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            value={newItem}
                            placeholder={param.placeholder}
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
                            disabled={!trimmed}
                            onClick={addItem}
                            size="icon-md"
                            variant="secondary"
                            aria-label="Додати синонім"
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
