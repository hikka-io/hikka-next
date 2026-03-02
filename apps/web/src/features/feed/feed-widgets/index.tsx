'use client';

import { Settings2 } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import { useOpenWidgetSettings } from '../hooks/use-open-widget-settings';
import WidgetList from './components/widget-list';

const FeedWidgets = () => {
    const openSettingsModal = useOpenWidgetSettings();
    const scrollRef = useRef(null);
    const { gradientClassName } = useScrollGradientMask(scrollRef);

    return (
        <div className="flex flex-col gap-4">
            <Button
                variant="outline"
                className="w-full text-muted-foreground"
                size="md"
                onClick={openSettingsModal}
            >
                <Settings2 />
                Налаштувати віджети
            </Button>
            <div
                ref={scrollRef}
                className={cn(
                    'flex flex-col gap-4 max-h-[calc(100vh-12rem)] overflow-auto no-scrollbar',
                    gradientClassName,
                )}
            >
                <WidgetList />
            </div>
        </div>
    );
};

export default FeedWidgets;
