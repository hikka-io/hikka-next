import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import ActivityHeatmap from './components/activity-heatmap';
import ActivityStats from './components/activity-stats';

const UserActivity = () => {
    return (
        <Card className="p-0 py-4" id="user-activity">
            <Header className="px-4">
                <HeaderContainer>
                    <HeaderTitle variant="h4">Активність</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <div className="px-4">
                <ActivityHeatmap />
            </div>
            <ActivityStats />
        </Card>
    );
};

export default UserActivity;
