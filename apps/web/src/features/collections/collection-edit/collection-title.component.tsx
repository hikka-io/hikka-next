'use client';

import { useParams } from 'next/navigation';

import BasicEditor from '../../../components/markdown/editor/basic-editor';
import {
    Header,
    HeaderContainer,
    HeaderTitle,
} from '../../../components/ui/header';
import { useCollectionContext } from '../../../services/providers/collection-provider';
import RulesAlert from './collection-rules-alert.component';

const CollectionTitle = () => {
    const { reference } = useParams();

    const title = useCollectionContext((state) => state.title);
    const description = useCollectionContext((state) => state.description);

    const setDescription = useCollectionContext(
        (state) => state.setDescription,
    );

    return (
        <div className="flex flex-col gap-4">
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">
                        {title || 'Нова колекція'}
                    </HeaderTitle>
                </HeaderContainer>
            </Header>
            <RulesAlert />
            {((reference && description !== undefined) || !reference) && (
                <BasicEditor
                    onValueChange={setDescription}
                    placeholder="Введіть опис"
                    initialValue={description}
                />
            )}
        </div>
    );
};

export default CollectionTitle;
