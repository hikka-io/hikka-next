import React from 'react';

import SubHeader from '@/app/_components/sub-header';

import Activity from './_components/activity';
import Watch from './_components/watch';

const Component = () => {
    return (
        <div className="flex flex-col gap-8">
            <SubHeader title={`Статистика`} />
            <div className="flex flex-col md:flex-row gap-8">
                <Activity />
                <Watch />
            </div>
        </div>
    );
};

export default Component;