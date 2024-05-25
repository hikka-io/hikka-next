import Anime from '@/features/characters/character-view/anime.component';
import Description from '@/features/characters/character-view/description.component';
import Voices from '@/features/characters/character-view/voices.component';

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
