import { Children, Fragment, type PropsWithChildren } from 'react';

import IconamoonSignDivisionSlashThin from '@/components/icons/iconamoon/IconamoonSignDivisionSlashThin';
import useScrollTrigger from '@/services/hooks/use-scroll-trigger';
import { cn } from '@/utils/cn';

type NavBreadcrumbsProps = PropsWithChildren;

/**
 * Page-context row for mobile, where there is no navbar. Sticks to the top of
 * the viewport and bleeds past the page padding; the negative top margin
 * cancels the safe-area padding it re-adds, so it costs no extra space until
 * it is pinned.
 */
const NavBreadcrumbs = ({ children }: NavBreadcrumbsProps) => {
    const arrayChildren = Children.toArray(children);

    const trigger = useScrollTrigger({
        threshold: 8,
        disableHysteresis: true,
    });

    if (arrayChildren.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                '-mx-4 -mt-[calc(2rem+env(safe-area-inset-top))] sticky top-0 z-20 mb-4 flex min-h-12 items-center gap-4 overflow-hidden border-b border-b-transparent bg-transparent px-4 pt-[env(safe-area-inset-top)] backdrop-blur transition-[background-color,border-color,backdrop-filter] md:hidden',
                trigger &&
                    'border-b-border bg-background/80 backdrop-blur-xl backdrop-saturate-150',
            )}
        >
            {Children.map(arrayChildren, (child, index) => (
                <Fragment key={index}>
                    <IconamoonSignDivisionSlashThin
                        className={cn(
                            'shrink-0 opacity-30',
                            index === 0 && 'hidden',
                        )}
                    />
                    {child}
                </Fragment>
            ))}
        </div>
    );
};

export default NavBreadcrumbs;
