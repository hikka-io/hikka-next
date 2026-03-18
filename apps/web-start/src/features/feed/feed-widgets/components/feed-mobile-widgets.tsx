'use client';

import { useSession } from '@hikka/react';
import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { cn } from '@/utils/cn';

import { useOpenWidgetSettings } from '../../hooks/use-open-widget-settings';
import WidgetList from './widget-list';

const FeedMobileWidgets = () => {
    const { user } = useSession();
    const { openSettings: openSettingsModal, settingsModal } = useOpenWidgetSettings();

    return (
        <Dialog>
            {settingsModal}
            <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="md"
                        className="flex-1 text-muted-foreground"
                    >
                        Віджети
                    </Button>
                </DialogTrigger>
                {user && (
                    <Button
                        variant="outline"
                        size="icon-md"
                        className="text-muted-foreground"
                        onClick={openSettingsModal}
                    >
                        <Settings2 className="size-4" />
                    </Button>
                )}
            </div>
            <DialogContent
                className={cn('h-dvh p-0 flex flex-col overflow-hidden')}
            >
                <DialogHeader className="bg-secondary/20 p-4">
                    <DialogTitle>Віджети</DialogTitle>
                </DialogHeader>
                <div className="gap-4 overflow-auto p-4 flex-1 flex flex-col w-full h-full">
                    <WidgetList />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FeedMobileWidgets;
