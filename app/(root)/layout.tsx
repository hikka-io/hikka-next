import Filters from './layout/Filters';
import NavBar from './layout/NavBar';
import { ReactNode } from 'react';

interface Props {
    list: ReactNode;
}

const Component = ({ list }: Props) => {
    return (
        <div className="md:mt-24">
            <div className="drawer drawer-end">
                <input
                    id="filterDrawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content flex md:flex-row flex-col justify-center md:items-baseline md:justify-between md:gap-12">
                    <div className="md:flex-[2.5] flex flex-col gap-8">
                        <NavBar />
                        {list}
                    </div>
                    <div className="order-1 md:flex-1 md:order-2 md:sticky md:top-0 md:block hidden">
                        <Filters />
                    </div>
                </div>
                <div className="drawer-side z-10 md:hidden">
                    <label
                        htmlFor="filterDrawer"
                        className="drawer-overlay"
                    ></label>
                    <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
                        <Filters />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
