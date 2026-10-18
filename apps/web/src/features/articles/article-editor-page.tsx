import {
    type ComponentProps,
    type FC,
    type RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';

import { ContentTypeEnum, getArticleOptions } from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import { usePreventUnsavedClose } from '@/services/hooks/use-prevent-unsaved-close';
import { useSession } from '@/services/session';
import { CONTENT_TYPE_LINKS, contentPath } from '@/utils/content-paths';
import { useRouter } from '@/utils/navigation';

import ArticleContentPicker from './article-edit/article-content-picker';
import ArticleEditDocument from './article-edit/article-document';
import ArticleEditorAuthor from './article-edit/article-editor-author';
import ArticleProvider, {
    ArticleContext,
    useArticleContext,
    useArticleStoreApi,
} from './article-edit/article-provider';
import { articleToState } from './article-edit/article-store';
import ArticleTagsInput from './article-edit/article-tags-input';
import ArticleTitleInput from './article-edit/article-title-input';
import HeaderActions from './article-edit/publish-card/header-actions';
import PublishCard from './article-edit/publish-card/publish-card';
import PublishDrawer from './article-edit/publish-card/publish-drawer';
import { describeSave } from './article-edit/publish-card/save-status-label';
import UnsavedChangesDialog from './article-edit/unsaved-changes-dialog';
import {
    type ArticleSave,
    readCreatedArticle,
    selectUnsavedBlocking,
    useArticleSave,
} from './article-edit/use-article-save';

type Props = {
    slug?: string;
};

type LayoutProps = {
    title: string;
    parent: string;
    author?: ComponentProps<typeof ArticleEditorAuthor>['author'];
};

type HeaderControls = {
    save: ArticleSave['save'];
    openSettings: () => void;
};

// The mobile header renders outside the provider and keeps the slot it gets,
// so the slot is created once and reaches the page through the store and a ref.
function createHeaderActions(
    store: ReturnType<typeof useArticleStoreApi>,
    controls: RefObject<HeaderControls>,
) {
    return function ArticleHeaderActions() {
        return (
            <ArticleContext.Provider value={store}>
                <HeaderActions
                    save={() => controls.current.save()}
                    onOpenSettings={() => controls.current.openSettings()}
                />
            </ArticleContext.Provider>
        );
    };
}

const ArticleEditorLayout: FC<LayoutProps> = ({ title, parent, author }) => {
    const store = useArticleStoreApi();
    const save = useArticleSave();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const status = useArticleContext((state) => describeSave(state).label);
    const blocking = useArticleContext(selectUnsavedBlocking);
    const blocker = usePreventUnsavedClose(blocking, { navigation: true });

    const controls = useRef<HeaderControls>({
        save: save.save,
        openSettings: () => setSettingsOpen(true),
    });

    useEffect(() => {
        controls.current.save = save.save;
    });

    const [actionsComponent] = useState(() =>
        createHeaderActions(store, controls),
    );

    usePageHeader({ title, subtitle: status, parent, actionsComponent });

    return (
        <>
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,48rem)_20rem] lg:items-start lg:justify-center">
                <article className="flex min-w-0 flex-col gap-8">
                    {author && <ArticleEditorAuthor author={author} />}
                    <div className="flex flex-col gap-3">
                        <ArticleContentPicker />
                        <ArticleTitleInput />
                        <ArticleTagsInput />
                    </div>
                    <ArticleEditDocument />
                </article>
                <PublishCard
                    save={save}
                    className="hidden md:flex lg:sticky lg:top-20"
                />
            </div>
            <PublishDrawer
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                save={save}
            />
            <UnsavedChangesDialog blocker={blocker} />
        </>
    );
};

const ArticleEditorUpdate: FC<Required<Props>> = ({ slug }) => {
    const { data: article } = useQuery(getArticleOptions({ path: { slug } }));

    if (!article) return null;

    return (
        <ArticleProvider initialState={articleToState(article)}>
            <ArticleEditorLayout
                title={article.title}
                parent={contentPath(ContentTypeEnum.ARTICLE, slug)}
                author={article.author}
            />
        </ArticleProvider>
    );
};

const ArticleEditorNew: FC = () => {
    const { user } = useSession();
    const router = useRouter();
    const location = useRouterState({ select: (state) => state.location });
    // Read once: the entry gains this state on the first save while the editor stays mounted.
    const [created] = useState(() => readCreatedArticle(location.state));

    useEffect(() => {
        if (!created) return;

        router.replace(
            `${contentPath(ContentTypeEnum.ARTICLE, created)}/update`,
            { ignoreBlocker: true },
        );
    }, [created, router]);

    // Back or forward onto an article this entry already created opens that article.
    if (created) return null;

    return (
        <ArticleProvider>
            <ArticleEditorLayout
                title="Нова стаття"
                parent={CONTENT_TYPE_LINKS.article}
                author={user}
            />
        </ArticleProvider>
    );
};

const ArticleEditorPage: FC<Props> = ({ slug }) =>
    slug === undefined ? (
        <ArticleEditorNew />
    ) : (
        <ArticleEditorUpdate slug={slug} />
    );

export default ArticleEditorPage;
