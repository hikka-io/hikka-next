import React, { memo, PropsWithChildren, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

const TextExpand = ({ children }: PropsWithChildren) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (ref.current) {
            setIsExpanded(!(ref.current.scrollHeight > 216));
        }
    }, []);

    return (
        <div className="relative">
            <div
                ref={ref}
                className={cn(
                    'relative overflow-hidden',
                    !isExpanded && 'max-h-52 unexpanded-text',
                )}
            >
                {children}
            </div>
            {!isExpanded && (
                <div className="flex w-full items-center">
                    <Button
                        variant="link"
                        size="sm"
                        className="p-0"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Згорнути...' : 'Показати більше...'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default memo(TextExpand);
