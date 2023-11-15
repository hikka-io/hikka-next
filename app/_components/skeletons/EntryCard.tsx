interface Props {}

const Component = ({}: Props) => {
    return (
        <div className="flex flex-col gap-2 animate-pulse">
            <div className="w-full bg-inherit pt-[140%] relative overflow-hidden rounded-lg">
                <div className="absolute w-full h-full top-0 left-0 bg-secondary/60" />
            </div>
            <div className="flex flex-col gap-2 py-3">
                <div className="bg-secondary/60 h-2 w-full rounded-lg" />
                <div className="bg-secondary/60 h-2 w-1/3 rounded-lg" />
            </div>
        </div>
    );
};

export default Component;
