import Links from '@/app/anime/[slug]/_layout/Links';

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Links extended />
        </div>
    );
};

export default Component;
