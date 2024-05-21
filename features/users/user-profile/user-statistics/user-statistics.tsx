import Block from '@/components/ui/block';
import Header from '@/components/ui/header';

import ActivityStats from './activity-stats/activity-stats';
import WatchhourStats from './watchhour-stats';

const UserStatistics = () => {
    return (
        <Block>
            <Header title={`Статистика`} />
            <Block className="md:flex-row">
                <ActivityStats />
                <WatchhourStats />
            </Block>
        </Block>
    );
};

export default UserStatistics;
