import React from 'react';

import Ongoings from '@/app/(pages)/(root)/components/ongoings';
import UserCover from '@/components/user-cover';
import { getCookie } from '@/utils/cookies';

import Collections from './components/collections';
import Comments from './components/comments';
import History from './components/history/history';
import Profile from './components/profile';
import Schedule from './components/schedule/schedule';


const Page = async () => {
    const auth = await getCookie('auth');

    return (
        <div className="flex flex-col gap-16">
            <UserCover />
            <Ongoings />
            {auth && (
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                    <Profile />
                    <History />
                </div>
            )}
            <Schedule />
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                <Collections />
                <Comments />
            </div>
        </div>
    );
};

export default Page;
