import React from 'react';

import Anime from '@/app/(pages)/characters/[slug]/components/anime';
import Description from '@/app/(pages)/characters/[slug]/components/description';
import Voices from '@/app/(pages)/characters/[slug]/components/voices';

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
