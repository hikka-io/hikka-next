import { PropsWithChildren } from 'react';
import Staff from "../layout/Staff";

interface Props extends PropsWithChildren {
    params: { slug: string };
}

const Component = async ({ params: { slug } }: Props) => {
    return (
        <div className="flex flex-col gap-12">
            <Staff extended />
        </div>
    );
};

export default Component;
