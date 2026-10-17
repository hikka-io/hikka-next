import { type FC, type ReactNode, useId, useState } from 'react';

import {
    ArrowRightLeft,
    Bookmark,
    EyeOff,
    Filter,
    Layers,
    ListOrdered,
    Maximize,
    Minimize,
    Type,
    X,
} from 'lucide-react';

import type { MainContentTypeEnum } from '@hikka/api';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { Badge } from '@/components/ui/badge';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Button, type ButtonProps } from '@/components/ui/button';
import { DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { CONTENT_TYPES } from '@/utils/labels';

import { type GraphEdgeType, RELATION_TYPE_GROUPS } from '../franchise-model';
import { EDGE_TYPES, RELATION_GROUP_STYLES } from '../relation-groups';
import type { GraphLabels } from './graph-filters-store';

export type EdgeFilter = (typeof EDGE_TYPES)[number] & {
    count: number;
    on: boolean;
};

export type MediaFilter = {
    type: MainContentTypeEnum;
    count: number;
    on: boolean;
};

type Props = {
    filters: EdgeFilter[];
    /** Filters that differ from their defaults. */
    changed: number;
    onToggle: (type: GraphEdgeType) => void;
    media: MediaFilter[];
    onToggleMedia: (type: MainContentTypeEnum) => void;
    mine: boolean | null;
    onToggleMine: () => void;
    hideUnlinked: boolean;
    onToggleHideUnlinked: () => void;
    labels: GraphLabels;
    onLabelsChange: (labels: GraphLabels) => void;
    order: boolean | null;
    onToggleOrder: () => void;
    horizontal: boolean;
    onToggleHorizontal: () => void;
    onReset: () => void;
    fullscreen: boolean;
    onToggleFullscreen: () => void;
    title?: string;
    isDesktop: boolean;
};

type BodyProps = Pick<
    Props,
    | 'media'
    | 'onToggleMedia'
    | 'mine'
    | 'onToggleMine'
    | 'hideUnlinked'
    | 'onToggleHideUnlinked'
    | 'labels'
    | 'onLabelsChange'
    | 'order'
    | 'onToggleOrder'
    | 'horizontal'
    | 'onToggleHorizontal'
>;

// Mirrors the mobile page header's action buttons.
const HEADER_BUTTON_CLASS = 'shrink-0 text-muted-foreground [&_svg]:size-5';

const RELATION_LINES = Object.fromEntries(
    EDGE_TYPES.map(({ type }) => [
        type,
        () => (
            <span
                className={cn(
                    'w-3.5 shrink-0 border-current border-t-2',
                    type === 'adaptation' && 'border-dashed',
                    RELATION_GROUP_STYLES[RELATION_TYPE_GROUPS[type]].text,
                )}
            />
        ),
    ]),
);

const LABEL_OPTIONS: Record<GraphLabels, { title_ua: string }> = {
    all: { title_ua: 'Усі' },
    focus: { title_ua: 'Обрані' },
    none: { title_ua: 'Без підписів' },
};

const toggled = <T extends string>(before: T[], after: T[]) =>
    before.find((value) => !after.includes(value)) ??
    after.find((value) => !before.includes(value));

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

const FilterSection: FC<{
    icon: ReactNode;
    title: string;
    children: ReactNode;
}> = ({ icon, title, children }) => (
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
            {icon}
            <Label>{title}</Label>
        </div>
        {children}
    </div>
);

const FilterSwitch: FC<{
    icon: ReactNode;
    label: string;
    checked: boolean;
    onCheckedChange: () => void;
}> = ({ icon, label, checked, onCheckedChange }) => {
    const id = useId();

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
                {icon}
                <Label htmlFor={id}>{label}</Label>
            </div>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
        </div>
    );
};

const FiltersBody: FC<BodyProps> = ({
    media,
    onToggleMedia,
    mine,
    onToggleMine,
    hideUnlinked,
    onToggleHideUnlinked,
    labels,
    onLabelsChange,
    order,
    onToggleOrder,
    horizontal,
    onToggleHorizontal,
}) => {
    const selectedMedia = media
        .filter((item) => item.on)
        .map((item) => item.type);

    return (
        <div className="flex flex-col gap-8">
            <FilterSection icon={<Type />} title="Підписи">
                <BadgeFilter
                    property="labels"
                    properties={LABEL_OPTIONS}
                    selected={[labels]}
                    onParamChange={(_, value) => {
                        const next = toggled([labels], value as GraphLabels[]);
                        if (next && next !== labels) onLabelsChange(next);
                    }}
                />
            </FilterSection>
            {media.length > 0 && (
                <FilterSection icon={<Layers />} title="Інші медіа">
                    <BadgeFilter
                        property="media"
                        properties={Object.fromEntries(
                            media.map((item) => [
                                item.type,
                                CONTENT_TYPES[item.type],
                            ]),
                        )}
                        icons={CONTENT_TYPE_ICONS}
                        selected={selectedMedia}
                        onParamChange={(_, value) => {
                            const type = toggled(
                                selectedMedia,
                                value as MainContentTypeEnum[],
                            );
                            if (type) onToggleMedia(type);
                        }}
                    />
                </FilterSection>
            )}
            {order !== null && (
                <FilterSwitch
                    icon={<ListOrdered />}
                    label="Порядок перегляду"
                    checked={order}
                    onCheckedChange={onToggleOrder}
                />
            )}
            {mine !== null && (
                <FilterSwitch
                    icon={<Bookmark />}
                    label="Лише мій список"
                    checked={mine}
                    onCheckedChange={onToggleMine}
                />
            )}
            <FilterSwitch
                icon={<EyeOff />}
                label="Сховати вимкнені тайтли"
                checked={hideUnlinked}
                onCheckedChange={onToggleHideUnlinked}
            />
            <FilterSwitch
                icon={<ArrowRightLeft />}
                label="Горизонтальний вигляд"
                checked={horizontal}
                onCheckedChange={onToggleHorizontal}
            />
        </div>
    );
};

const ResetButton: FC<{ disabled: boolean; onReset: () => void }> = ({
    disabled,
    onReset,
}) => (
    <Button variant="outline" size="md" disabled={disabled} onClick={onReset}>
        <AntDesignClearOutlined /> Очистити
    </Button>
);

const ChangedBadge: FC<{ changed: number; className?: string }> = ({
    changed,
    className,
}) =>
    changed > 0 && (
        <Badge
            variant="default"
            className={cn('h-4 min-w-4 px-1 text-[10px]', className)}
        >
            {changed}
        </Badge>
    );

const FiltersPopover: FC<BodyProps & Pick<Props, 'changed' | 'onReset'>> = ({
    changed,
    onReset,
    ...body
}) => (
    <Popover>
        <PopoverTrigger
            render={<Button variant="outline" size="sm" className="shrink-0" />}
        >
            <Filter />
            Фільтри
            <ChangedBadge changed={changed} />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-96 gap-0 p-0">
            <div className="p-4">
                <FiltersBody {...body} />
            </div>
            <div className="flex flex-col border-t p-4">
                <ResetButton disabled={changed === 0} onReset={onReset} />
            </div>
        </PopoverContent>
    </Popover>
);

const FiltersModal: FC<BodyProps & Pick<Props, 'changed' | 'onReset'>> = ({
    changed,
    onReset,
    ...body
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon-md"
                aria-label="Фільтри"
                className={cn(HEADER_BUTTON_CLASS, 'relative overflow-visible')}
                onClick={() => setOpen(true)}
            >
                <Filter />
                <ChangedBadge
                    changed={changed}
                    className="absolute top-0 right-0"
                />
            </Button>
            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalContent title="Фільтри графа">
                    <FiltersBody {...body} />
                    <ResponsiveModalFooter className="flex-col gap-3">
                        <ResetButton
                            disabled={changed === 0}
                            onReset={onReset}
                        />
                        <Button size="md" onClick={() => setOpen(false)}>
                            Готово
                        </Button>
                    </ResponsiveModalFooter>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

const RelationChips: FC<Pick<Props, 'filters' | 'onToggle'>> = ({
    filters,
    onToggle,
}) => {
    const selected = filters
        .filter((filter) => filter.on)
        .map((filter) => filter.type);

    return (
        <fieldset
            aria-label="Типи зв’язків"
            className="no-scrollbar m-0 min-w-0 shrink-0 overflow-x-auto border-b px-4 py-2"
        >
            <BadgeFilter
                property="relations"
                properties={Object.fromEntries(
                    filters.map((filter) => [
                        filter.type,
                        { title_ua: filter.label },
                    ]),
                )}
                icons={RELATION_LINES}
                counts={Object.fromEntries(
                    filters.map((filter) => [filter.type, filter.count]),
                )}
                selected={selected}
                onParamChange={(_, value) => {
                    const type = toggled(selected, value as GraphEdgeType[]);
                    if (type) onToggle(type);
                }}
                className="max-md:flex-nowrap"
            />
        </fieldset>
    );
};

const CloseButton: FC<{ inHeader: boolean }> = ({ inHeader }) => (
    <Tooltip>
        <TooltipTrigger
            render={
                <DialogClose
                    render={
                        <Button
                            variant={inHeader ? 'ghost' : 'outline'}
                            size={inHeader ? 'icon-md' : 'icon-sm'}
                            aria-label="Закрити"
                            className={cn(inHeader && HEADER_BUTTON_CLASS)}
                        />
                    }
                />
            }
        >
            <X />
        </TooltipTrigger>
        <TooltipContent>Закрити</TooltipContent>
    </Tooltip>
);

const GraphToolbar: FC<Props> = ({
    filters,
    onToggle,
    changed,
    onReset,
    fullscreen,
    onToggleFullscreen,
    title,
    isDesktop,
    ...body
}) => {
    const chips = <RelationChips filters={filters} onToggle={onToggle} />;

    if (!isDesktop) {
        return (
            <>
                <div className="flex h-14 shrink-0 items-center gap-1 border-b pr-2 pl-4">
                    <div className="flex min-w-0 flex-1 flex-col">
                        <DialogTitle>{title}</DialogTitle>
                        <span className="text-muted-foreground text-xs">
                            Франшиза
                        </span>
                    </div>
                    <FiltersModal
                        changed={changed}
                        onReset={onReset}
                        {...body}
                    />
                    <CloseButton inHeader />
                </div>
                {chips}
            </>
        );
    }

    const fullscreenLabel = fullscreen
        ? 'Вийти з повноекранного режиму'
        : 'На весь екран';

    return (
        <>
            <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
                <DialogTitle className="min-w-0 flex-1 truncate font-bold">
                    Франшиза «{title}»
                </DialogTitle>
                <FiltersPopover changed={changed} onReset={onReset} {...body} />
                <Separator orientation="vertical" className="h-5" />
                <IconButton
                    label={fullscreenLabel}
                    onClick={onToggleFullscreen}
                >
                    {fullscreen ? <Minimize /> : <Maximize />}
                </IconButton>
                <CloseButton inHeader={false} />
            </div>
            {chips}
        </>
    );
};

export default GraphToolbar;
