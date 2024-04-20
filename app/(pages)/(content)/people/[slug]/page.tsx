import React from 'react';

import Anime from './components/anime';
import Characters from './components/characters';

const PersonPage = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Characters />
            <Anime />
        </div>
    );
};

export default PersonPage;
