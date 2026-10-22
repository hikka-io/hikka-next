import { type ComponentType, useEffect, useRef } from 'react';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';

import { chipVariants } from '@/components/ui/chip';
import { CHIP_IDLE, SELECTED_TINT } from '@/components/ui/selected-tint';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

type IconComponent = ComponentType<{ className?: string }>;

export type ChipTabOption<T extends string> = {
    label: string;
    value: T;
    count?: number;
    icon?: IconComponent;
    activeClass?: string;
    to?: string;
    search?: Record<string, unknown>;
};

type Props<T extends string> = {
    options: ChipTabOption<T>[];
    value: T;
    onValueChange?: (value: T) => void;
    className?: string;
};

const chipClassName = <T extends string>(
    option: ChipTabOption<T>,
    isActive: boolean,
) =>
    cn(
        chipVariants(),
        'border border-transparent px-3.5 text-sm',
        isActive ? (option.activeClass ?? SELECTED_TINT) : CHIP_IDLE,
    );

// An explicit aria-label replaces the name computed from the content, so the
// count is folded in rather than dropped.
const chipAriaLabel = <T extends string>(option: ChipTabOption<T>) =>
    option.count !== undefined
        ? `${option.label}: ${option.count}`
        : option.label;

const ChipContent = <T extends string>({
    option,
}: {
    option: ChipTabOption<T>;
}) => {
    const Icon = option.icon;

    return (
        <>
            {Icon && <Icon className="size-4 shrink-0" />}
            {option.label}
            {option.count !== undefined && (
                <span className="tabular-nums opacity-60">{option.count}</span>
            )}
        </>
    );
};

function ChipTabs<T extends string>({
    options,
    value,
    onValueChange,
    className,
}: Props<T>) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    // Horizontal only: scrollIntoView would also scroll the page to a row below the fold.
    // biome-ignore lint/correctness/useExhaustiveDependencies(value): re-run when the active chip changes
    useEffect(() => {
        const row = scrollRef.current;
        const active = row?.querySelector(
            '[aria-current="page"], [aria-selected="true"]',
        );
        if (!row || !active) return;

        const rowRect = row.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        if (activeRect.right > rowRect.right) {
            row.scrollLeft += activeRect.right - rowRect.right;
        }
    }, [value]);

    const rowClassName = cn(
        'no-scrollbar -mr-4 flex gap-2 overflow-x-auto pr-4',
        gradientClassName,
    );

    if (options.some((option) => option.to)) {
        return (
            <div ref={scrollRef} className={cn(rowClassName, className)}>
                {options.map((option) => {
                    const isActive = value === option.value;

                    return (
                        <Link
                            key={option.value}
                            to={option.to ?? '.'}
                            search={isActive ? true : (option.search ?? {})}
                            activeOptions={{ exact: true }}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={chipAriaLabel(option)}
                            className={chipClassName(option, isActive)}
                        >
                            <ChipContent option={option} />
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <TabsPrimitive.Root
            value={value}
            onValueChange={(next) => onValueChange?.(next as T)}
            className={className}
        >
            <TabsPrimitive.List ref={scrollRef} className={rowClassName}>
                {options.map((option) => (
                    <TabsPrimitive.Tab
                        key={option.value}
                        value={option.value}
                        aria-label={chipAriaLabel(option)}
                        className={chipClassName(
                            option,
                            value === option.value,
                        )}
                    >
                        <ChipContent option={option} />
                    </TabsPrimitive.Tab>
                ))}
            </TabsPrimitive.List>
        </TabsPrimitive.Root>
    );
}

export { ChipTabs };
