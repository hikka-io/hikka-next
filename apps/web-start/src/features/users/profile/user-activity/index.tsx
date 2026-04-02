'use client';

import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import ActivityHeatmap from './components/activity-heatmap';

const UserActivity = () => {
    return (
        <Card className="bg-secondary/20" id="user-activity">
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h4">Активність</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <ActivityHeatmap />
        </Card>
    );
};

export default UserActivity;
