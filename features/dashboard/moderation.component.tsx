'use client';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import useModerationLog from '@/services/hooks/moderation/use-moderation-log';
import { convertModerationLog } from '@/utils/convert-moderation-log';

import Header from './header';
import HistoryItem from './history-item.component';

const Moderation = () => {
    const { list: moderationLog } = useModerationLog({});

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
                <Button className="w-full" variant="accent">
                    Переглянути журнал
                </Button>
            </Card>
        </div>
    );
};

export default Moderation;
