'use client';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import useModerationLog from '@/services/hooks/moderation/use-moderation-log';
import { useModalContext } from '@/services/providers/modal-provider';
import { convertModerationLog } from '@/utils/convert-moderation-log';

import Header from '../components/header';
import HistoryItem from '../edits-block/history-item.component';
import ModerationLogModal from './moderation-log-modal';

const Moderation = () => {
    const { list: moderationLog } = useModerationLog({});

    const { openModal } = useModalContext();

    const handleOpenModal = () => {
        openModal({
            type: 'sheet',
            title: 'Журнал модерації',
            side: 'right',
            content: <ModerationLogModal />,
        });
    };

    return (
        <div className="flex w-1/3 flex-col gap-12">
            <Header title="Модерація" href="" />
            <Card className="flex flex-1 justify-between backdrop-blur">
                <div className="flex flex-col gap-6">
                    {moderationLog?.slice(0, 7).map((elem) => (
                        <span key={elem.target_type}>
                            <HistoryItem
                                key={elem.reference}
                                data={convertModerationLog(elem)}
                            />
                        </span>
                    ))}
                </div>
                <Button
                    className="w-full"
                    variant="accent"
                    onClick={
                        moderationLog && moderationLog?.length > 0
                            ? handleOpenModal
                            : undefined
                    }
                >
                    Переглянути журнал
                </Button>
            </Card>
        </div>
    );
};

export default Moderation;
