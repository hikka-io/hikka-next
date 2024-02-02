'use client';

import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Dispatch, SetStateAction, useState } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import MaterialSymbolsCloseSmallRounded from '~icons/material-symbols/close-small-rounded';

import { Button } from '@/app/_components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/app/_components/ui/collapsible';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';

interface EditProps {
    title: string;
    inputTitle: string;
    selected: string[];
    setList: Dispatch<SetStateAction<string[]>>;
    mode: 'edit';
}

interface ViewProps {
    title: string;
    inputTitle?: string;
    selected: string[];
    setList?: Dispatch<SetStateAction<string[]>>;
    mode: 'view';
}

const Component = ({
    title,
    inputTitle,
    selected,
    setList,
    mode,
}: EditProps | ViewProps) => {
    const [newItem, setNewItem] = useState<string>();

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
                <div className="flex gap-2 flex-wrap">
                    {selected.map((item) => {
                        return (
                            <div
                                className="flex gap-2 items-center px-2 py-1 border border-secondary/30 text-sm rounded-md bg-secondary/30"
                                key={item}
                            >
                                {item}
                                {mode === 'edit' && (
                                    <Button
                                        onClick={() =>
                                            setList((prev) =>
                                                prev.filter((s) => s !== item),
                                            )
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
                {mode === 'edit' && <div className="flex flex-col gap-4 w-full">
                    <Label>{inputTitle}</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            disabled={newItem?.length === 0}
                            onClick={() => {
                                setList((prev) => [...prev, String(newItem)]);
                                setNewItem('');
                            }}
                            size="icon"
                            variant="secondary"
                        >
                            <MaterialSymbolsAddRounded />
                        </Button>
                    </div>
                </div>}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Component;