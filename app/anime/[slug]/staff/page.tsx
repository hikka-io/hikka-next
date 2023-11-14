import Staff from '@/app/anime/[slug]/_layout/Staff';

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Staff extended />
        </div>
    );
};

export default Component;
