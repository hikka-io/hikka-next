interface Props {}

const Component = ({}: Props) => {
    return (
        <div className="flex animate-pulse flex-col gap-2">
            <div className="relative w-full overflow-hidden rounded-lg bg-inherit pt-[140%]">
                <div className="absolute left-0 top-0 size-full bg-secondary/20" />
            </div>
            <div className="flex flex-col gap-2 py-3">
                <div className="h-2 w-full rounded-lg bg-secondary/20" />
                <div className="h-2 w-1/3 rounded-lg bg-secondary/20" />
            </div>
        </div>
    );
};

export default Component;
