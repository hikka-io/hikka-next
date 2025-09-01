'use client';

import { useTopEditorsList } from '@hikka/react';

import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { EditTopStatsModal } from '@/features/modals';

import { useModalContext } from '@/services/providers/modal-provider';

import EditTopItem from './edit-top-item';

function EditTopStats() {
    const { openModal } = useModalContext();
    const { list } = useTopEditorsList();

    if (!list || list.length === 0) {
        return null;
    }

    const handleOpenModal = () => {
        openModal({
            content: <EditTopStatsModal />,
            title: 'Топ авторів',
            type: 'sheet',
        });
    };

    return (
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
                    onClick={handleOpenModal}
                    variant="outline"
                    className="h-auto flex-1"
                >
                    <MaterialSymbolsMoreHoriz className="text-muted-foreground text-4xl" />
                </Button>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}

export default EditTopStats;
