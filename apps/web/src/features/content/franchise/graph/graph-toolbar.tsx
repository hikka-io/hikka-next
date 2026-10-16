import { type FC, type ReactNode, useId, useRef, useState } from 'react';

import { Bookmark, Filter, Maximize, Minimize } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { SELECTED_TINT } from '@/components/ui/selected-tint';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
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

const IconButton: FC<Omit<ButtonProps, 'aria-label'> & { label: string }> = ({
    label,
    ...props
}) => (
    <Tooltip>
        <TooltipTrigger
            render={
                <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={label}
                    {...props}
                />
            }
        />
        <TooltipContent>{label}</TooltipContent>
    </Tooltip>
);

const SwitchRow: FC<{
    label: ReactNode;
    checked: boolean;
    onCheckedChange: () => void;
}> = ({ label, checked, onCheckedChange }) => {
    const id = useId();

    return (
        <div className="flex items-center justify-between gap-4">
            <Label htmlFor={id} className="flex flex-1 items-center gap-2">
                {label}
            </Label>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
        </div>
    );
};

const FiltersModal: FC<
    Pick<Props, 'filters' | 'onToggle' | 'mine' | 'onToggleMine'>
> = ({ filters, onToggle, mine, onToggleMine }) => {
    const [open, setOpen] = useState(false);
    const enabled = filters.filter((filter) => filter.on).length;

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                <Filter />
                Фільтри
                <span className="text-muted-foreground tabular-nums">
                    {enabled}/{filters.length}
                </span>
            </Button>
            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalContent title="Фільтри графа">
                    <div className="flex flex-col gap-4">
                        {filters.map((filter) => (
                            <SwitchRow
                                key={filter.type}
                                checked={filter.on}
                                onCheckedChange={() => onToggle(filter.type)}
                                label={
                                    <>
                                        <Dot
                                            on
                                            className={
                                                RELATION_GROUP_STYLES[
                                                    filter.group
                                                ].text
                                            }
                                        />
                                        {filter.longLabel}
                                        <span className="text-muted-foreground tabular-nums">
                                            {filter.count}
                                        </span>
                                    </>
                                }
                            />
                        ))}
                        {mine !== null && (
                            <SwitchRow
                                label="Лише мій список"
                                checked={mine}
                                onCheckedChange={onToggleMine}
                            />
                        )}
                    </div>
                    <ResponsiveModalFooter>
                        <Button size="md" onClick={() => setOpen(false)}>
                            Готово
                        </Button>
                    </ResponsiveModalFooter>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
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
    const chipsRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(chipsRef, 'horizontal');
    const fullscreenLabel = fullscreen
        ? 'Вийти з повноекранного режиму'
        : 'На весь екран';

    return (
        <div className="flex items-center gap-3 border-b px-4 py-3 max-md:px-3 max-md:py-2.5">
            {isDesktop ? (
                <>
                    {fullscreen && title && (
                        <span className="max-w-xs shrink-0 truncate font-bold">
                            Франшиза «{title}»
                        </span>
                    )}
                    <div
                        ref={chipsRef}
                        className={cn(
                            'no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto',
                            gradientClassName,
                        )}
                    >
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
                        <IconButton
                            label="Лише мій список"
                            aria-pressed={mine}
                            className={cn(mine && SELECTED_TINT)}
                            onClick={onToggleMine}
                        >
                            <Bookmark className={cn(mine && 'fill-current')} />
                        </IconButton>
                    )}
                </>
            ) : (
                <>
                    <FiltersModal
                        filters={filters}
                        onToggle={onToggle}
                        mine={mine}
                        onToggleMine={onToggleMine}
                    />
                    <span className="flex-1" />
                </>
            )}
            <IconButton label={fullscreenLabel} onClick={onToggleFullscreen}>
                {fullscreen ? <Minimize /> : <Maximize />}
            </IconButton>
        </div>
    );
};

export default GraphToolbar;
