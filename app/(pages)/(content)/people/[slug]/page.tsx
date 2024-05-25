import Anime from '@/features/people/person-view/anime.component';
import Characters from '@/features/people/person-view/characters.component';

const PersonPage = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Characters />
            <Anime />
        </div>
    );
};

export default PersonPage;
