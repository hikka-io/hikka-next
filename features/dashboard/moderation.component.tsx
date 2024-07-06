'use client';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import useEditList from '@/services/hooks/edit/use-edit-list';

import Header from './header';
import HistoryItem from './history-item.component';

const Moderation = () => {
    // TODO: replace with moderator_log
    const { data: editList } = useEditList({ status: 'accepted' });

    return (
        <div className="flex w-1/3 flex-col gap-12">
            <Header title="Модерація" href="" />
            <Card className="flex flex-1 justify-between backdrop-blur">
                <div className="flex flex-col gap-6">
                    {editList?.list.slice(0, 7).map((edit) => (
                        <span key={edit.edit_id}>
                            <HistoryItem
                                username={edit.moderator!.username}
                                time={edit.updated}
                                status={edit.status}
                                edit_id={edit.edit_id}
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
