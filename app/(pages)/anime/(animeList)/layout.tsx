import { ReactNode } from 'react';

import Filters from './_components/filters';
import NavBar from './_components/navbar';

interface Props {
    list: ReactNode;
}

// export const runtime = 'edge';

const Component = async ({ list }: Props) => {
    return (
        <div>
            <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                <div className="flex flex-col gap-8">
                    <NavBar />
                    {list}
                </div>
                <div className="order-1 hidden w-full lg:order-2 lg:block">
                    <Filters />
                </div>
            </div>
        </div>
    );
};

export default Component;