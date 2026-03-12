'use client';

import { useSession } from '@hikka/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import WidgetSection from '../../feed-widgets/components/widget-section';
import SidebarContentStats from './sidebar-content-stats';
import SidebarNavigation from './sidebar-navigation';
import SidebarProfile from './sidebar-profile';

const FeedCombinedSidebar = () => {
    const { user } = useSession();

    if (!user) {
        return (
            <div className="flex flex-col gap-4">
                <SidebarProfile />
                <SidebarNavigation />
                <WidgetSection />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 lg:max-h-[calc(100vh-9rem)]">
            <SidebarProfile />
            <SidebarNavigation />
            <Tabs defaultValue="widgets" className="flex min-h-0 flex-col">
                <TabsList className="w-full shrink-0">
                    <TabsTrigger value="widgets">Віджети</TabsTrigger>
                    <TabsTrigger value="stats">Списки</TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="overflow-auto">
                    {user && <SidebarContentStats />}
                </TabsContent>
                <TabsContent value="widgets" className="overflow-hidden flex">
                    <WidgetSection />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FeedCombinedSidebar;
