import { type FC, lazy, Suspense, useState } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

import { useFranchise } from '../use-franchise';
import { useGraphOverlay } from '../use-graph-overlay';

const FranchiseGraph = lazy(() => import('./franchise-graph'));

const POPUP_CLASS =
    'inset-0 w-auto max-h-none max-w-none translate-x-0 gap-0 p-0 pt-[env(safe-area-inset-top,0px)] ring-0 md:inset-12 md:max-h-none md:max-w-none md:translate-y-0 md:overflow-hidden md:pt-0 md:ring-1';
const FULLSCREEN_CLASS = 'md:inset-0 md:rounded-none md:ring-0';

type Props = {
    content_type: MainContentTypeEnum;
    slug: string;
};

const FranchiseGraphSkeleton: FC = () => (
    <>
        <div className="flex h-14 shrink-0 items-center border-b px-4">
            <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="flex-1 rounded-none" />
    </>
);

const FranchiseGraphDialog: FC<Props> = ({ content_type, slug }) => {
    const [open, setOpen] = useGraphOverlay();
    const { data: model, isPending } = useFranchise(content_type, slug, open);
    const [selected, setSelected] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    return (
        <Dialog
            backClose={false}
            open={open && (isPending || Boolean(model))}
            onOpenChange={(next, details) => {
                if (!next && details?.reason === 'escape-key') {
                    if (expanded) {
                        setExpanded(false);
                        return;
                    }
                    if (selected) {
                        setSelected(null);
                        return;
                    }
                }
                if (!next) {
                    setSelected(null);
                    setExpanded(false);
                }
                setOpen(next);
            }}
        >
            <DialogContent
                showCloseButton={false}
                className={cn(POPUP_CLASS, fullscreen && FULLSCREEN_CLASS)}
            >
                {model ? (
                    <Suspense fallback={<FranchiseGraphSkeleton />}>
                        <FranchiseGraph
                            model={model}
                            selected={selected}
                            onSelectedChange={setSelected}
                            expanded={expanded}
                            onExpandedChange={setExpanded}
                            fullscreen={fullscreen}
                            onToggleFullscreen={() =>
                                setFullscreen(!fullscreen)
                            }
                        />
                    </Suspense>
                ) : (
                    <FranchiseGraphSkeleton />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FranchiseGraphDialog;
