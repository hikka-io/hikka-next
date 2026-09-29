import { PlateMarkdownEditor } from '@/components/plate/editor/plate-editor';
import RulesAlert from '@/components/rules-alert';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { useParams } from '@/utils/navigation';

import { useCollectionContext } from './collection-provider';

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
            <RulesAlert
                rulesFile="COLLECTION_RULES.md"
                before="Перш ніж створювати колекції, рекомендуємо ознайомитись з"
                after="створення колекцій."
                modalTitle="Правила колекцій"
            />
            {((reference && description !== undefined) || !reference) && (
                <PlateMarkdownEditor
                    onValueChange={setDescription}
                    placeholder="Введіть опис"
                    modalTitle="Опис колекції"
                    modalButtonTitle="Написати опис"
                    modalEditButtonTitle="Редагувати опис"
                    value={description}
                />
            )}
        </div>
    );
};

export default CollectionTitle;
