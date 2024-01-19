import Favorites from './_layout/favorites';
import ListStats from './_layout/list-stats';

const Component = () => {
    return (
        <div className="flex flex-col gap-12">
            <ListStats />
            <Favorites />
        </div>
    );
};

export default Component;
