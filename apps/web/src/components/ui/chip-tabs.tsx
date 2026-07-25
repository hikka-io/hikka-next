import { type ComponentType, useRef } from 'react';

import { Chip } from '@/components/ui/chip';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

type IconComponent = ComponentType<{ className?: string }>;

const DEFAULT_ACTIVE_CLASS =
    'border border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground';

export type ChipTabOption<T extends string> = {
    label: string;
    value: T;
    icon?: IconComponent;
    activeClass?: string;
    /** Renders the tab as a link instead of a button. */
    to?: string;
    search?: Record<string, unknown>;
};

type Props<T extends string> = {
    options: ChipTabOption<T>[];
    value: T;
    onValueChange?: (value: T) => void;
    className?: string;
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

    return (
        <div
            ref={scrollRef}
            role="tablist"
            className={cn(
                'no-scrollbar -mr-4 flex gap-2 overflow-x-auto pr-4',
                gradientClassName,
                className,
            )}
        >
            {options.map((option) => {
                const isActive = value === option.value;
                const Icon = option.icon;
                const content = (
                    <>
                        {Icon && <Icon className="size-4 shrink-0" />}
                        {option.label}
                    </>
                );
                const chipProps = {
                    role: 'tab',
                    'aria-selected': isActive,
                    'aria-label': option.label,
                    className: cn(
                        'border border-transparent px-3.5 text-sm',
                        isActive
                            ? (option.activeClass ?? DEFAULT_ACTIVE_CLASS)
                            : 'bg-secondary/40 text-muted-foreground hover:bg-accent',
                    ),
                };

                return option.to ? (
                    <Chip key={option.value} asChild {...chipProps}>
                        <Link to={option.to} search={option.search}>
                            {content}
                        </Link>
                    </Chip>
                ) : (
                    <Chip
                        key={option.value}
                        onClick={() => onValueChange?.(option.value)}
                        {...chipProps}
                    >
                        {content}
                    </Chip>
                );
            })}
        </div>
    );
}

export { ChipTabs };
