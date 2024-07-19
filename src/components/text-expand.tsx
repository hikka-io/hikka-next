import {
    ComponentPropsWithoutRef,
    memo,
    useEffect,
    useRef,
    useState,
} from 'react';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/utils';

interface Props extends ComponentPropsWithoutRef<'div'> {
    expanded?: boolean;
    setExpanded?: (expanded: boolean) => void;
}

const TextExpand = ({
    children,
    expanded: _expanded,
    setExpanded: _setExpanded,
    className,
}: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const expanded = _expanded ? _expanded : isExpanded;
    const setExpanded = _setExpanded ? _setExpanded : setIsExpanded;

    useEffect(() => {
        if (ref.current) {
            setExpanded(!(ref.current.scrollHeight > 216));
        }
    }, []);

    return (
        <div className="relative">
            <div
                ref={ref}
                className={cn(
                    'relative overflow-hidden',
                    !expanded && 'unexpanded-text max-h-52',
                    !expanded && className,
                )}
            >
                {children}
            </div>
            {!expanded && (
                <div className="flex w-full items-center">
                    <Button
                        variant="link"
                        size="sm"
                        className="p-0"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? 'Згорнути...' : 'Показати більше...'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default memo(TextExpand);
