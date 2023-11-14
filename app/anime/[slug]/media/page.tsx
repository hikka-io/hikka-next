import Media from '@/app/anime/[slug]/_layout/Media';

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Media extended />
        </div>
    );
};

export default Component;
