'use client';

import { useTopEditorsList } from '@hikka/react';
import { useState } from 'react';

import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { EditTopStatsModal } from '@/features/edit';

import EditTopItem from './components/edit-top-item';

function EditTopStats() {
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);
    const { list } = useTopEditorsList();

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <>
            <ScrollArea className="no-scrollbar -mx-4">
                <div className="flex gap-4 px-4">
                    {list.slice(0, 4).map((stat, index) => (
                        <EditTopItem
                            key={stat.user.reference}
                            rank={index + 1}
                            user={stat.user}
                            accepted={stat.accepted}
                            closed={stat.closed}
                            denied={stat.denied}
                        />
                    ))}
                    <Button
                        onClick={() => setOpen(true)}
                        variant="outline"
                        className="h-auto flex-1"
                    >
                        <MaterialSymbolsMoreHoriz className="text-muted-foreground text-4xl" />
                    </Button>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Топ авторів">
                    <EditTopStatsModal />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
}

export default EditTopStats;
