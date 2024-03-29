import React from 'react';

import SubHeader from '@/components/sub-header';

import FollowingItem from './components/following-item';


const Followings = () => {
    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Відслідковуються" href="/" />
            <div className="flex flex-col gap-6">
                <FollowingItem />
            </div>
        </div>
    );
};

export default Followings;
