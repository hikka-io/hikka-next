import Anime from '@/features/people/person-view/anime';
import Characters from '@/features/people/person-view/characters';

const PersonPage = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Characters />
            <Anime />
        </div>
    );
};

export default PersonPage;
