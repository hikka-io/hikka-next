import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import ActivityStats from './components/user-statistics/activity-stats';
import WatchhourStats from './components/user-statistics/watchhour-stats';

const UserStatistics = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Статистика</HeaderTitle>
                </HeaderContainer>
            </Header>
            <Block className="md:flex-row">
                <ActivityStats />
                <WatchhourStats />
            </Block>
        </Block>
    );
};

export default UserStatistics;
