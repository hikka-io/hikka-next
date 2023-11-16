import List from "@/app/u/[username]/list/_layout/List";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Список',
}

const Component = () => {
    return <List />;
};

export default Component;
