import Favorites from '@/app/u/[username]/_layout/Favorites';

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Favorites extended />
        </div>
    );
};

export default Component;
