'use client';

import { useSession } from '@hikka/react';
import { Settings2 } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

import Card from '@/components/ui/card';
import { useOpenWidgetSettings } from '../../hooks/use-open-widget-settings';
import WidgetList from './widget-list';

interface Props {
    className?: string;
}

const WidgetSection: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const openSettingsModal = useOpenWidgetSettings();

    return (
        <Card className={cn('flex flex-col gap-0 h-auto overflow-hidden max-h-[calc(100vh-10rem)] bg-secondary/20 backdrop-blur p-0', className)}>
            <WidgetList />
            {user && (
                <div className='p-4 bg-secondary/20 border-t'>
                    <Button
                        variant="outline"
                        className="w-full shrink-0 text-muted-foreground backdrop-blur"
                        size="md"
                        onClick={openSettingsModal}
                    >
                        <Settings2 />
                        Налаштувати віджети
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default WidgetSection;
