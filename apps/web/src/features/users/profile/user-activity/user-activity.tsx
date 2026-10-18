import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';

import ActivityHeatmap from './components/activity-heatmap';
import ActivityStats from './components/activity-stats';

const UserActivity = () => {
    return (
        <Block variant="card" id="user-activity">
            <Header>
                <HeaderTitle>Активність</HeaderTitle>
            </Header>
            <ActivityHeatmap />
            <ActivityStats />
        </Block>
    );
};

export default UserActivity;
