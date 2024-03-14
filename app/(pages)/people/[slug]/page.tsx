import React from 'react';

import Anime from './_components/anime';
import Characters from './_components/characters';

const Component = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Characters />
            <Anime />
        </div>
    );
};

export default Component;
