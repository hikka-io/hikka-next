import type { FC, ReactNode } from 'react';
import * as React from 'react';

import {
    AlignLeft,
    LucideChevronsUpDown,
    type LucideIcon,
    Tags,
    Type,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { getEditParamComponent } from '../utils/edit-param-utils';

type Props = {
    title: string;
    groupKey: string;
    params: Hikka.EditParam[];
    mode: 'view' | 'edit' | 'update';
    warning?: ReactNode;
    /** Start expanded in `edit` mode (view/update are always open). */
    defaultOpen?: boolean;
};

const GROUP_META: Record<string, { icon: LucideIcon; description: string }> = {
    title: { icon: Type, description: 'Основні назви різними мовами' },
    synopsis: { icon: AlignLeft, description: 'Опис тайтлу різними мовами' },
    description: { icon: AlignLeft, description: 'Опис різними мовами' },
    synonyms: {
        icon: Tags,
        description: 'Альтернативні назви та варіанти написання',
    },
};

const EditGroup: FC<Props> = ({
    title,
    groupKey,
    params,
    mode,
    warning,
    defaultOpen = false,
}) => {
    const [selected, setSelected] = React.useState<string[]>([]);

    const meta = GROUP_META[groupKey];
    const Icon = meta?.icon ?? Type;

    const switchParam = (param: string) => {
        setSelected((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param],
        );
    };

    return (
        <Card>
            <Collapsible
                open={mode === 'view' || mode === 'update' ? true : undefined}
                defaultOpen={defaultOpen}
            >
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="flex w-full items-center gap-4 text-left"
                    >
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Icon className="size-5" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <h5>{title}</h5>
                            {meta?.description && (
                                <span className="text-muted-foreground text-sm">
                                    {meta.description}
                                </span>
                            )}
                        </div>
                        <LucideChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4 flex w-full flex-col gap-6 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    {warning}

                    {(mode === 'edit' || mode === 'update') &&
                        params.length > 1 && (
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
                        if (
                            mode !== 'view' &&
                            params.length > 1 &&
                            !selected.includes(param.slug)
                        )
                            return null;

                        const ParamComponent = getEditParamComponent(
                            param.type,
                        );

                        return (
                            <ParamComponent
                                key={param.slug}
                                param={param}
                                mode={mode === 'update' ? 'edit' : mode}
                            />
                        );
                    })}
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default EditGroup;
