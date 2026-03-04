'use client';

import { useSession } from '@hikka/react';
import { Settings2 } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

import { useOpenWidgetSettings } from '../../hooks/use-open-widget-settings';
import WidgetList from './widget-list';

interface Props {
    className?: string;
}

const WidgetSection: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const openSettingsModal = useOpenWidgetSettings();

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {user && (
                <Button
                    variant="outline"
                    className="w-full shrink-0 text-muted-foreground backdrop-blur"
                    size="md"
                    onClick={openSettingsModal}
                >
                    <Settings2 />
                    Налаштувати віджети
                </Button>
            )}
            <WidgetList />
        </div>
    );
};

export default WidgetSection;
