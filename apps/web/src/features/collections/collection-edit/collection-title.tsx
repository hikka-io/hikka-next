import { PlateMarkdownEditor } from '@/components/plate/editor/markdown-editor';
import RulesAlert from '@/components/rules-alert';
import { Header, HeaderTitle } from '@/components/ui/header';
import { useParams } from '@/utils/navigation';

import { useCollectionContext } from './collection-provider';

const CollectionEditTitle = () => {
    const { reference } = useParams();

    const title = useCollectionContext((state) => state.title);
    const description = useCollectionContext((state) => state.description);

    const setDescription = useCollectionContext(
        (state) => state.setDescription,
    );

    return (
        <div className="flex flex-col gap-4">
            <Header>
                <HeaderTitle as="h1" size="page">
                    {title || 'Нова колекція'}
                </HeaderTitle>
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

export default CollectionEditTitle;
