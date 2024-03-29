import React from 'react';

import Anime from '@/app/(pages)/people/[slug]/components/anime';
import Characters from '@/app/(pages)/people/[slug]/components/characters';

const PersonPage = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Characters />
            <Anime />
        </div>
    );
};

export default PersonPage;
