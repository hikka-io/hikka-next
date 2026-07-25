import type { PageHeaderConfig } from './page-header-context';

export type TitleVisibilityInput = {
    config: PageHeaderConfig | null;
    hasAnchor: boolean;
    passedAnchor: boolean;
};

/**
 * Decides whether the mobile header title — and the content action bar that
 * mirrors it — should be visible.
 *
 * A null anchor is ambiguous on its own: it means both "this page has no
 * anchor" and "the anchor has not registered yet". The `anchored` flag on the
 * page config disambiguates, so the title is never shown optimistically and
 * then withdrawn.
 */
export const resolveTitleVisibility = ({
    config,
    hasAnchor,
    passedAnchor,
}: TitleVisibilityInput): boolean => {
    if (!config) {
        return false;
    }

    if (!config.anchored) {
        return true;
    }

    return hasAnchor && passedAnchor;
};
