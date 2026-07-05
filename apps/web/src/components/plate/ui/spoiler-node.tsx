import { EyeOff } from 'lucide-react';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { cn } from '@/utils/cn';

export function SpoilerElement(props: PlateElementProps) {
    return (
        <PlateElement
            as="div"
            className={cn(
                'relative rounded-md border border-dashed border-border surface-inset p-2 pt-6',
                'spoiler',
            )}
            {...props}
        >
            <span
                contentEditable={false}
                className="absolute left-2 top-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground select-none"
            >
                <EyeOff className="size-3" />
                Спойлер
            </span>
            {props.children}
        </PlateElement>
    );
}
