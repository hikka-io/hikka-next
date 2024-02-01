import Favorites from './_components/favorites';
import ListStats from './_components/list-stats';

const Component = () => {
    return (
        <div className="flex flex-col gap-12">
            <ListStats />
            <Favorites />
        </div>
    );
};

export default Component;
