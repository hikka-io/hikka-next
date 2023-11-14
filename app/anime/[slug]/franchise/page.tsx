import Franchise from '@/app/anime/[slug]/_layout/Franchise';

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Franchise extended />
        </div>
    );
};

export default Component;
