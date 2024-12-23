'use client';

import { useParams } from 'next/navigation';

import PlateEditor from '@/components/markdown/editor/plate-editor';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import RulesAlert from '@/features/collections/collection-edit/collection-rules-alert.component';

import { useCollectionContext } from '@/services/providers/collection-provider';

const CollectionTitle = () => {
    const { reference } = useParams();

    const {
        title,
        description,
        setState: setCollectionState,
    } = useCollectionContext();

    return (
        <div className="flex flex-col gap-4">
            <Header>
                <HeaderContainer>
                    <HeaderTitle>{title || 'Нова колекція'}</HeaderTitle>
                </HeaderContainer>
            </Header>
            <RulesAlert />
            {((reference && description !== undefined) || !reference) && (
                <PlateEditor
                    onValueChange={(markdown) =>
                        setCollectionState!((state) => ({
                            ...state,
                            description: markdown,
                        }))
                    }
                    placeholder="Введіть опис"
                    initialValue={description}
                />
            )}
        </div>
    );
};

export default CollectionTitle;
