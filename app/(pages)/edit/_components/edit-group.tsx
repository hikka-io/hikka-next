'use client';

import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { getEditParamComponent } from '@/utils/editParamUtils';
import H5 from '@/components/typography/h5';

interface Props {
    title: string;
    params: Hikka.EditParam[];
    mode: 'view' | 'edit';
}

const Component = ({ title, params, mode }: Props) => {
    const [selected, setSelected] = React.useState<string[]>([]);

    const switchParam = (param: string) => {
        setSelected((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param],
        );
    };

    return (
        <Collapsible open={mode === 'view' ? true : undefined} className="w-full space-y-2 border border-accent rounded-lg p-4">
            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between">
                    <H5>{title}</H5>
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
                {mode === 'edit' && params.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {params.map((param) => (
                            <Button
                                size="badge"
                                variant={
                                    selected.includes(param.slug)
                                        ? 'default'
                                        : 'outline'
                                }
                                key={param.slug}
                                onClick={() => switchParam(param.slug)}
                            >
                                {param.title}
                            </Button>
                        ))}
                    </div>
                )}
                {params.map((param) => {
                    if (mode !== 'view' && params.length > 1 && !selected.includes(param.slug)) return null;

                    const Component = getEditParamComponent(param.type);

                    return (
                        <Component
                            key={param.slug}
                            param={param}
                            mode={mode}
                        />
                    );
                })}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Component;
