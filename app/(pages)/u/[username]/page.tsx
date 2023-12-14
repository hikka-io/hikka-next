import Favorites from './_layout/Favorites';
import ListStats from './_layout/ListStats';

const Component = () => {
    return (
        <div className="flex flex-col gap-12">
            <ListStats />
            <Favorites />
        </div>
    );
};

export default Component;
