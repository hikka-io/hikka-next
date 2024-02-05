import ActivityItem from './ui/activity-item';
import SubHeader from '@/app/_components/sub-header';
import { cn } from '@/utils';

interface Props {
    className?: string;
}

const Component = ({ className }:Props) => {
    return (
        <div className={cn("flex flex-col gap-8", className)}>
            <SubHeader title={'Активність'} />
            <div className="flex flex-col gap-4">
                <ActivityItem />
                <ActivityItem />
                <ActivityItem />
            </div>
        </div>
    );
};

export default Component;
