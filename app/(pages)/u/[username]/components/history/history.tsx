'use client';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import NotFound from '@/components/ui/not-found';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import ActivityModal from './components/history-modal';
import ActivityItem from './components/ui/history-item';
import useUserHistory from '@/services/hooks/user/useUserHistory';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { list: activity } = useUserHistory({
        username: String(params.username),
    });

    const filteredActivity = activity?.slice(0, 3);

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <SubHeader
                title={'Історія'}
                onClick={
                    activity && activity?.length > 0
                        ? () =>
                              openModal({
                                  type: 'sheet',
                                  title: 'Активність',
                                  side: 'right',
                                  content: <ActivityModal />,
                              })
                        : undefined
                }
            />
            <div className="flex flex-col gap-6">
                {filteredActivity &&
                    filteredActivity.map((item) => (
                        <ActivityItem data={item} key={item.reference} />
                    ))}
                {activity && activity?.length === 0 && (
                    <NotFound
                        title={'Історія відсутня'}
                        description="Інформація оновиться після змін у списку"
                    />
                )}
            </div>
        </div>
    );
};

export default Component;