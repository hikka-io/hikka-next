'use client';

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

interface Props extends ComponentPropsWithoutRef<'div'> {
    expanded?: boolean;
    setExpanded?: (expanded: boolean) => void;
    maxHeight?: number;
    expandText?: string;
    collapseText?: string;
    showGradient?: boolean;
    alwaysCollapsed?: boolean;
}

const TextExpand = ({
    children,
    expanded: _expanded,
    setExpanded: _setExpanded,
    maxHeight = 208,
    expandText = 'Показати більше...',
    collapseText = 'Згорнути...',
    showGradient = true,
    alwaysCollapsed = false,
    className,
    ...rest
}: Props) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [needsExpansion, setNeedsExpansion] = useState(false);

    const expanded = alwaysCollapsed
        ? false
        : _expanded !== undefined
          ? _expanded
          : isExpanded;
    const setExpanded = _setExpanded || setIsExpanded;

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const measure = () => {
            const next = el.scrollHeight > maxHeight;
            setNeedsExpansion((prev) => (prev === next ? prev : next));
        };

        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(el);

        return () => ro.disconnect();
    }, [maxHeight]);

    const shouldShowCollapsed =
        alwaysCollapsed || (!expanded && needsExpansion);

    const shouldShowGradient =
        shouldShowCollapsed && showGradient && needsExpansion;

    return (
        <div {...rest} className="relative">
            <div
                className={cn(
                    'relative overflow-hidden',
                    shouldShowCollapsed && className,
                    shouldShowGradient && 'gradient-mask-b-90',
                )}
                style={{
                    maxHeight: shouldShowCollapsed
                        ? `${maxHeight}px`
                        : undefined,
                }}
            >
                <div ref={contentRef}>{children}</div>
            </div>

            {!alwaysCollapsed && needsExpansion && (
                <div className="flex w-full items-center justify-start pt-2">
                    <Button
                        variant="link"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground h-auto p-0 text-sm font-medium"
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        aria-label={expanded ? collapseText : expandText}
                    >
                        {expanded ? collapseText : expandText}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TextExpand;
