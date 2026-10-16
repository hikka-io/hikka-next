import { type FC, type ReactNode, useId, useState } from 'react';

import {
    Bookmark,
    Filter,
    Layers,
    Link,
    Maximize,
    Minimize,
} from 'lucide-react';

import type { MainContentTypeEnum } from '@hikka/api';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { Badge } from '@/components/ui/badge';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Button, type ButtonProps } from '@/components/ui/button';
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
    onReset: () => void;
    fullscreen: boolean;
    onToggleFullscreen: () => void;
    title?: string;
    isDesktop: boolean;
};

type BodyProps = Pick<
    Props,
    'filters' | 'onToggle' | 'media' | 'onToggleMedia' | 'mine' | 'onToggleMine'
>;

// Mirrors the mobile page header's action buttons.
const HEADER_BUTTON_CLASS = 'shrink-0 text-muted-foreground [&_svg]:size-5';

const RELATION_DOTS = Object.fromEntries(
    EDGE_TYPES.map(({ type }) => [
        type,
        () => (
            <span
                className={cn(
                    'size-2 shrink-0 rounded-full',
                    RELATION_GROUP_STYLES[RELATION_TYPE_GROUPS[type]].solid,
                )}
            />
        ),
    ]),
);

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

const FiltersBody: FC<BodyProps> = ({
    filters,
    onToggle,
    media,
    onToggleMedia,
    mine,
    onToggleMine,
}) => {
    const mineId = useId();
    const selectedTypes = filters
        .filter((filter) => filter.on)
        .map((filter) => filter.type);
    const selectedMedia = media
        .filter((item) => item.on)
        .map((item) => item.type);

    return (
        <div className="flex flex-col gap-8">
            <FilterSection icon={<Link />} title="Зв’язки">
                <BadgeFilter
                    property="relations"
                    properties={Object.fromEntries(
                        filters.map((filter) => [
                            filter.type,
                            { title_ua: filter.longLabel },
                        ]),
                    )}
                    icons={RELATION_DOTS}
                    selected={selectedTypes}
                    onParamChange={(_, value) => {
                        const type = toggled(
                            selectedTypes,
                            value as GraphEdgeType[],
                        );
                        if (type) onToggle(type);
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
            {mine !== null && (
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Bookmark className="size-4 shrink-0" />
                        <Label htmlFor={mineId}>Лише мій список</Label>
                    </div>
                    <Switch
                        id={mineId}
                        checked={mine}
                        onCheckedChange={onToggleMine}
                    />
                </div>
            )}
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

const FiltersTrigger: FC<
    Omit<ButtonProps, 'aria-label'> & { changed: number; inHeader: boolean }
> = ({ changed, inHeader, className, ...props }) => (
    <Button
        variant={inHeader ? 'ghost' : 'outline'}
        size={inHeader ? 'icon-md' : 'icon-sm'}
        aria-label="Фільтри"
        className={cn(
            'relative shrink-0 overflow-visible',
            inHeader && HEADER_BUTTON_CLASS,
            className,
        )}
        {...props}
    >
        <Filter />
        {changed > 0 && (
            <Badge
                variant="default"
                className={cn(
                    'absolute h-4 min-w-4 px-1 text-[10px]',
                    inHeader ? 'top-0 right-0' : '-top-1.5 -right-1.5',
                )}
            >
                {changed}
            </Badge>
        )}
    </Button>
);

const FiltersPopover: FC<BodyProps & Pick<Props, 'changed' | 'onReset'>> = ({
    changed,
    onReset,
    ...body
}) => (
    <Popover>
        <Tooltip>
            <TooltipTrigger
                render={
                    <PopoverTrigger
                        render={
                            <FiltersTrigger
                                changed={changed}
                                inHeader={false}
                            />
                        }
                    />
                }
            />
            <TooltipContent>Фільтри</TooltipContent>
        </Tooltip>
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

const FiltersModal: FC<
    BodyProps & Pick<Props, 'changed' | 'onReset'> & { inHeader: boolean }
> = ({ changed, onReset, inHeader, ...body }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <FiltersTrigger
                changed={changed}
                inHeader={inHeader}
                onClick={() => setOpen(true)}
            />
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

const Legend: FC<{ filters: EdgeFilter[] }> = ({ filters }) => (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5 font-medium text-muted-foreground text-xs">
        {filters.map((filter) => {
            const group =
                RELATION_GROUP_STYLES[RELATION_TYPE_GROUPS[filter.type]];

            return (
                <span
                    key={filter.type}
                    className={cn(
                        'inline-flex items-center gap-1.5',
                        !filter.on && 'opacity-40',
                    )}
                >
                    {filter.type === 'adaptation' ? (
                        <span
                            className={cn(
                                'w-3.5 shrink-0 border-t-2 border-dashed',
                                group.text,
                            )}
                        />
                    ) : (
                        <span
                            className={cn(
                                'size-2 shrink-0 rounded-full',
                                group.solid,
                            )}
                        />
                    )}
                    {filter.label}
                </span>
            );
        })}
    </div>
);

const GraphToolbar: FC<Props> = ({
    changed,
    onReset,
    fullscreen,
    onToggleFullscreen,
    title,
    isDesktop,
    ...body
}) => {
    const inHeader = !isDesktop && fullscreen && Boolean(title);
    const fullscreenLabel = fullscreen
        ? 'Вийти з повноекранного режиму'
        : 'На весь екран';

    return (
        <div
            className={cn(
                'flex items-center gap-3 border-b px-4 py-3 max-md:px-3 max-md:py-2.5',
                inHeader &&
                    'h-14 gap-1 py-0 pr-2 pl-4 max-md:py-0 max-md:pr-2 max-md:pl-4',
            )}
        >
            {isDesktop ? (
                <>
                    {fullscreen && title && (
                        <span className="max-w-1/2 shrink-0 truncate font-bold">
                            Франшиза «{title}»
                        </span>
                    )}
                    <Legend filters={body.filters} />
                    <FiltersPopover
                        changed={changed}
                        onReset={onReset}
                        {...body}
                    />
                </>
            ) : (
                <>
                    {inHeader && (
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-semibold text-sm">
                                {title}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                Франшиза
                            </span>
                        </div>
                    )}
                    <FiltersModal
                        changed={changed}
                        onReset={onReset}
                        inHeader={inHeader}
                        {...body}
                    />
                    {!inHeader && <span className="flex-1" />}
                </>
            )}
            <IconButton
                label={fullscreenLabel}
                onClick={onToggleFullscreen}
                {...(inHeader && {
                    variant: 'ghost',
                    size: 'icon-md',
                    className: HEADER_BUTTON_CLASS,
                })}
            >
                {fullscreen ? <Minimize /> : <Maximize />}
            </IconButton>
        </div>
    );
};

export default GraphToolbar;
