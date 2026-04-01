'use client';

import {
    ComponentPropsWithoutRef,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

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
    maxHeight = 208, // ~13rem in pixels (52 * 4)
    expandText = 'Показати більше...',
    collapseText = 'Згорнути...',
    showGradient = true,
    alwaysCollapsed = false,
    className,
    ...rest
}: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [needsExpansion, setNeedsExpansion] = useState(false);

    const expanded = alwaysCollapsed
        ? false
        : _expanded !== undefined
          ? _expanded
          : isExpanded;
    const setExpanded = _setExpanded || setIsExpanded;

    const measureContent = useCallback(() => {
        if (ref.current) {
            setNeedsExpansion(ref.current.scrollHeight > maxHeight);
        }
    }, [maxHeight]);

    useEffect(() => {
        measureContent();

        const el = ref.current;
        if (!el) return;

        const resizeObserver = new ResizeObserver(measureContent);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, [measureContent]);

    const handleToggle = useCallback(() => {
        setExpanded(!expanded);
    }, [expanded, setExpanded]);

    const shouldShowCollapsed =
        alwaysCollapsed || (!expanded && needsExpansion);

    const shouldShowGradient =
        shouldShowCollapsed && showGradient && needsExpansion;

    return (
        <div className="relative" {...rest}>
            <div
                ref={ref}
                className={cn(
                    'relative transition-all duration-300 ease-in-out',
                    shouldShowCollapsed && 'overflow-hidden',
                    shouldShowCollapsed && className,
                    shouldShowGradient && 'gradient-mask-b-90',
                )}
                style={{
                    maxHeight: shouldShowCollapsed
                        ? `${maxHeight}px`
                        : undefined,
                }}
                aria-expanded={expanded}
            >
                {children}
            </div>

            {!alwaysCollapsed && needsExpansion && (
                <div className="flex w-full items-center justify-start pt-2">
                    <Button
                        variant="link"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground h-auto p-0 text-sm font-medium"
                        onClick={handleToggle}
                        aria-label={expanded ? collapseText : expandText}
                    >
                        {expanded ? collapseText : expandText}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default memo(TextExpand);
