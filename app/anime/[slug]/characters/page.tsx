import Characters from '@/app/anime/[slug]/_layout/Characters';

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended />
        </div>
    );
};

export default Component;
