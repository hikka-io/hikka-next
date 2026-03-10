import { FC, PropsWithChildren, ReactNode } from 'react';

import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

import { cn } from '@/utils/cn';

interface Props extends PropsWithChildren {
    content: ReactNode;
    size?: 'md' | 'auto';
}

const HoverCardWrapper: FC<Props> = ({ children, content, size = 'md' }) => (
    <HoverCard openDelay={500} closeDelay={100}>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardPortal>
            <HoverCardContent
                side="right"
                className={cn(
                    'hidden flex-col gap-4 p-4 md:flex',
                    size === 'md' && 'w-80',
                    size === 'auto' && 'min-w-min',
                )}
            >
                <HoverCardArrow />
                {content}
            </HoverCardContent>
        </HoverCardPortal>
    </HoverCard>
);

export default HoverCardWrapper;
