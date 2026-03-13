'use client';

import { useSession } from '@hikka/react';
import { ArrowLeft, ArrowRight, Settings2 } from 'lucide-react';
import { FC, useCallback, useRef } from 'react';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import { cn } from '@/utils/cn';

import { useOpenWidgetSettings } from '../../hooks/use-open-widget-settings';
import WidgetList from './widget-list';

interface Props {
    className?: string;
}

const WidgetSection: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const openSettingsModal = useOpenWidgetSettings();
    const widgetListRef = useRef<HTMLDivElement>(null);

    const scroll = useCallback((direction: 'left' | 'right') => {
        const container = widgetListRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    }, []);

    return (
        <Card
            className={cn(
                'flex flex-col gap-0 h-auto overflow-hidden max-h-[calc(100vh-10rem)] bg-secondary/20 backdrop-blur-lg p-0',
                className,
            )}
        >
            <WidgetList ref={widgetListRef} />

            <div className="p-4 bg-secondary/20 border-t flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 text-muted-foreground"
                    size="md"
                    disabled={!user}
                    onClick={openSettingsModal}
                >
                    <Settings2 />
                    Налаштувати віджети
                </Button>
                <Button
                    variant="outline"
                    className="shrink-0 md:hidden"
                    size="icon-md"
                    onClick={() => scroll('left')}
                >
                    <ArrowLeft />
                </Button>
                <Button
                    variant="outline"
                    className="shrink-0 md:hidden"
                    size="icon-md"
                    onClick={() => scroll('right')}
                >
                    <ArrowRight />
                </Button>
            </div>
        </Card>
    );
};

export default WidgetSection;
