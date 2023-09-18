import Links from '../layout/Links';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    params: { slug: string };
}

const Component = async ({ params: { slug } }: Props) => {
    return (
        <div className="flex flex-col gap-12">
            <Links extended />
        </div>
    );
};

export default Component;
