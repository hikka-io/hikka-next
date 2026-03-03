'use client';

import { useSession } from '@hikka/react';
import { Settings2 } from 'lucide-react';
import { FC, useRef } from 'react';

import { Button } from '@/components/ui/button';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import { useOpenWidgetSettings } from '../../hooks/use-open-widget-settings';
import WidgetList from './widget-list';

interface Props {
    className?: string;
    scrollable?: boolean;
    maxHeight?: string;
}

const WidgetSection: FC<Props> = ({ className, scrollable, maxHeight }) => {
    const { user } = useSession();
    const openSettingsModal = useOpenWidgetSettings();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(scrollRef);

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {user && (
                <Button
                    variant="outline"
                    className="w-full shrink-0 text-muted-foreground"
                    size="md"
                    onClick={openSettingsModal}
                >
                    <Settings2 />
                    Налаштувати віджети
                </Button>
            )}
            {scrollable ? (
                <div
                    ref={scrollRef}
                    className={cn(
                        'flex flex-col gap-4 overflow-auto no-scrollbar',
                        maxHeight,
                        gradientClassName,
                    )}
                >
                    <WidgetList />
                </div>
            ) : (
                <WidgetList />
            )}
        </div>
    );
};

export default WidgetSection;
