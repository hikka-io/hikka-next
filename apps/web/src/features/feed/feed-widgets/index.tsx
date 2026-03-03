'use client';

import WidgetSection from './components/widget-section';

const FeedWidgets = () => {
    return (
        <WidgetSection
            scrollable
            maxHeight="max-h-[calc(100vh-12rem)]"
        />
    );
};

export default FeedWidgets;
