import {
    ComponentPropsWithoutRef,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { cn } from '@/utils/utils';

import { Button } from './ui/button';

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

    const checkIfNeedsExpansion = useCallback(() => {
        if (ref.current) {
            const needsExp = ref.current.scrollHeight > maxHeight;
            setNeedsExpansion(needsExp);

            // If content doesn't need expansion and not always collapsed, make sure it's expanded
            if (!needsExp && !expanded && !alwaysCollapsed) {
                setExpanded(true);
            }
        }
    }, [maxHeight, expanded, setExpanded, alwaysCollapsed]);

    useEffect(() => {
        checkIfNeedsExpansion();

        // Set up ResizeObserver to handle dynamic content changes
        if (ref.current) {
            const resizeObserver = new ResizeObserver(() => {
                checkIfNeedsExpansion();
            });

            resizeObserver.observe(ref.current);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [checkIfNeedsExpansion]);

    const handleToggle = useCallback(() => {
        setExpanded(!expanded);
    }, [expanded, setExpanded]);

    const maxHeightStyle = `${maxHeight}px`;

    // When alwaysCollapsed is true, we should always show content as collapsed
    const shouldShowCollapsed =
        alwaysCollapsed || (!expanded && needsExpansion);

    return (
        <div className="relative" {...rest}>
            <div
                ref={ref}
                className={cn(
                    'relative transition-all duration-300 ease-in-out',
                    shouldShowCollapsed && 'overflow-hidden',
                    // Only apply className (which might contain height constraints) when collapsed
                    shouldShowCollapsed && className,
                )}
                style={{
                    maxHeight: shouldShowCollapsed ? maxHeightStyle : undefined,
                }}
                aria-expanded={expanded}
            >
                {children}

                {/* Gradient overlay when collapsed */}
                {shouldShowCollapsed && showGradient && (
                    <div
                        className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent"
                        aria-hidden="true"
                    />
                )}
            </div>

            {/* Only show expand/collapse button when not alwaysCollapsed and content needs expansion */}
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
