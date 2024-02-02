import React from 'react';

import Anime from './_components/anime';
import Description from './_components/description';

const Component = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Description />
            <Anime />
        </div>
    );
};

export default Component;