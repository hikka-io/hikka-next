import { PropsWithChildren } from 'react';
import Franchise from "../layout/Franchise";

interface Props extends PropsWithChildren {
    params: { slug: string };
}

const Component = async ({ params: { slug } }: Props) => {
    return (
        <div className="flex flex-col gap-12">
            <Franchise extended />
        </div>
    );
};

export default Component;
