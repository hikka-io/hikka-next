import { ARTICLE_MARKS } from '../editor/plate-types';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButtons } from './mark-toolbar-buttons';
import { SpoilerToolbarButton } from './spoiler-toolbar-button';
import { ToolbarGroup } from './toolbar';

export function FloatingArticleToolbarButtons() {
    return (
        <>
            <MarkToolbarButtons marks={ARTICLE_MARKS} />
            <ToolbarGroup>
                <LinkToolbarButton />
                <SpoilerToolbarButton />
            </ToolbarGroup>
        </>
    );
}
