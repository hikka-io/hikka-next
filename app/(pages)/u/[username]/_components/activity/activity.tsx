'use client';

import { useParams } from 'next/navigation';

import { useActivityList } from '@/app/(pages)/u/[username]/page.hooks';
import SubHeader from '@/components/sub-header';
import NotFound from '@/components/ui/not-found';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils';

import ActivityModal from './components/activity-modal';
import ActivityItem from './components/ui/activity-item';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { list: activity } = useActivityList({
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