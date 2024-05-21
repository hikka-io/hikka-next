import Anime from '@/features/characters/character-view/anime';
import Description from '@/features/characters/character-view/description';
import Voices from '@/features/characters/character-view/voices';

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
