import React from 'react';

import Anime from './_components/anime';
import Description from './_components/description';
import Voices from './_components/voices';

const Component = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Description />
            <Anime />
            <Voices />
        </div>
    );
};

export default Component;
