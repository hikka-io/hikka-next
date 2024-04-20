import React from 'react';

import Anime from './components/anime';
import Description from './components/description';
import Voices from './components/voices';

const CharacterPage = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Description />
            <Anime />
            <Voices />
        </div>
    );
};

export default CharacterPage;
