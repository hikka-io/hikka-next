import * as React from 'react';



import { Separator } from '@/app/_components/ui/separator';



import CollectionItem from './ui/collection-item';
import { Fragment } from 'react';


interface Props {
    collections?: API.WithPagination<API.Collection>;
}

const Component = ({ collections }: Props) => {
    if (!collections) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-x-16 gap-y-8">
            {collections.list.map((collection, index) => (
                <Fragment key={collection.reference}>
                    {index !== 0 && <Separator />}
                    <CollectionItem
                        collection={collection}

                    />
                </Fragment>
            ))}
        </div>
    );
};

export default Component;
