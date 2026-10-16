import type { FC } from 'react';

import { Bookmark, Maximize, Minimize } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { SELECTED_TINT } from '@/components/ui/selected-tint';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/cn';

import type { GraphEdgeType } from '../franchise-model';
import { type EDGE_TYPES, RELATION_GROUP_STYLES } from '../relation-groups';

export type EdgeFilter = (typeof EDGE_TYPES)[number] & {
    count: number;
    on: boolean;
};

type Props = {
    filters: EdgeFilter[];
    onToggle: (type: GraphEdgeType) => void;
    mine: boolean | null;
    onToggleMine: () => void;
    fullscreen: boolean;
    onToggleFullscreen: () => void;
    title?: string;
    isDesktop: boolean;
};

const Dot: FC<{ on: boolean; className?: string }> = ({ on, className }) => (
    <span
        className={cn(
            'size-2 shrink-0 rounded-full',
            on
                ? 'bg-current'
                : 'bg-transparent ring-[1.5px] ring-current ring-inset',
            className,
        )}
    />
);

const FiltersDrawer: FC<
    Pick<Props, 'filters' | 'onToggle' | 'mine' | 'onToggleMine'>
> = ({ filters, onToggle, mine, onToggleMine }) => {
    const enabled = filters.filter((filter) => filter.on);

    return (
        <Drawer>
            <DrawerTrigger
                render={
                    <Button variant="outline" size="sm" className="gap-2" />
                }
            >
                <span className="flex">
                    {enabled.map((filter) => (
                        <span
                            key={filter.type}
                            className={cn(
                                'not-first:-ml-1 size-2.5 rounded-full shadow-[0_0_0_2px_var(--card)]',
                                RELATION_GROUP_STYLES[filter.group].solid,
                            )}
                        />
                    ))}
                </span>
                Фільтри
                <span className="text-muted-foreground tabular-nums">
                    {enabled.length}/{filters.length}
                </span>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Фільтри графа</DrawerTitle>
                </DrawerHeader>
                <div className="-mx-2 flex flex-col py-2">
                    {filters.map((filter) => (
                        // biome-ignore lint/a11y/noLabelWithoutControl: the Switch inside is the control.
                        <label
                            key={filter.type}
                            className="flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 font-medium text-sm hover:bg-accent"
                        >
                            <Dot
                                on={filter.on}
                                className={
                                    filter.on
                                        ? RELATION_GROUP_STYLES[filter.group]
                                              .text
                                        : 'text-muted-foreground'
                                }
                            />
                            <span
                                className={cn(
                                    'flex-1',
                                    !filter.on && 'text-muted-foreground',
                                )}
                            >
                                {filter.longLabel}
                            </span>
                            <span className="text-muted-foreground tabular-nums">
                                {filter.count}
                            </span>
                            <Switch
                                checked={filter.on}
                                onCheckedChange={() => onToggle(filter.type)}
                            />
                        </label>
                    ))}
                    {mine !== null && (
                        // biome-ignore lint/a11y/noLabelWithoutControl: the Switch inside is the control.
                        <label className="mt-2 flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 font-medium text-sm hover:bg-accent">
                            <span className="flex-1">Лише мій список</span>
                            <Switch
                                checked={mine}
                                onCheckedChange={onToggleMine}
                            />
                        </label>
                    )}
                </div>
                <DrawerFooter>
                    <DrawerClose
                        render={
                            <Button
                                variant="secondary"
                                size="md"
                                className="w-full"
                            />
                        }
                    >
                        Готово
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

const GraphToolbar: FC<Props> = ({
    filters,
    onToggle,
    mine,
    onToggleMine,
    fullscreen,
    onToggleFullscreen,
    title,
    isDesktop,
}) => {
    const fullscreenLabel = fullscreen
        ? 'Вийти з повноекранного режиму'
        : 'На весь екран';

    return (
        <div className="flex items-center gap-3 border-b px-4 py-3 max-md:px-3 max-md:py-2.5">
            {isDesktop ? (
                <>
                    {fullscreen && title && (
                        <span className="mr-2 truncate font-bold">
                            Франшиза «{title}»
                        </span>
                    )}
                    <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
                        {filters.map((filter) => (
                            <Chip
                                key={filter.type}
                                aria-pressed={filter.on}
                                onClick={() => onToggle(filter.type)}
                                className={cn(
                                    'border',
                                    filter.on
                                        ? RELATION_GROUP_STYLES[filter.group]
                                              .chip
                                        : 'border-transparent bg-secondary/40 text-muted-foreground hover:bg-accent',
                                )}
                            >
                                <Dot on={filter.on} />
                                {filter.label}
                            </Chip>
                        ))}
                    </div>
                    {mine !== null && (
                        <Button
                            variant="outline"
                            size="icon-sm"
                            aria-pressed={mine}
                            aria-label="Лише мій список"
                            title="Лише мій список"
                            className={cn(mine && SELECTED_TINT)}
                            onClick={onToggleMine}
                        >
                            <Bookmark className={cn(mine && 'fill-current')} />
                        </Button>
                    )}
                </>
            ) : (
                <>
                    <FiltersDrawer
                        filters={filters}
                        onToggle={onToggle}
                        mine={mine}
                        onToggleMine={onToggleMine}
                    />
                    <span className="flex-1" />
                </>
            )}
            <Button
                variant="outline"
                size="icon-sm"
                aria-label={fullscreenLabel}
                title={fullscreenLabel}
                onClick={onToggleFullscreen}
            >
                {fullscreen ? <Minimize /> : <Maximize />}
            </Button>
        </div>
    );
};

export default GraphToolbar;
