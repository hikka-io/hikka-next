'use client';

import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import useEditTop from '@/services/hooks/stats/edit/use-edit-top';
import { useModalContext } from '@/services/providers/modal-provider';
import EditTopStatsModal from '../../modals/edit-top-stats-modal/edit-top-stats-modal.component';
import EditTopItem from './edit-top-item';

function EditTopStats() {
    const { openModal } = useModalContext();
    const { list } = useEditTop();

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
        <ScrollArea className="-mx-4 no-scrollbar">
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
                    className="flex-1 h-auto"
                >
                    <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                </Button>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}

export default EditTopStats;
