import { type FC, useState } from 'react';

import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';

import type { FranchiseModel, FranchiseNode } from '../franchise-model';
import GraphDetails, { GraphRelationsSection } from './graph-details';

// Snap points above 1 are pixels and 1 is the full height, so the measured peek is never 1.
const EXPANDED = 1;
// Until the title row is measured.
const PEEK_ESTIMATE = 120;

type Props = {
    model: FranchiseModel;
    node: FranchiseNode | undefined;
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    onClose: () => void;
    /** The visible height at the peek snap point, 0 until measured. */
    peek: number;
    onPeekChange: (height: number) => void;
    onSelect: (id: string) => void;
    onShow: (id: string) => void;
};

const GraphDrawer: FC<Props> = ({
    model,
    node,
    expanded,
    onExpandedChange,
    onClose,
    peek,
    onPeekChange,
    onSelect,
    onShow,
}) => {
    const peekPoint = peek || PEEK_ESTIMATE;
    // The last title stays in the drawer while it slides out.
    const [shown, setShown] = useState(node);
    if (node && node !== shown) setShown(node);

    // The peek shows the title row; the popup's bottom padding carries the safe area.
    const measurePeek = (row: HTMLDivElement | null) => {
        const popup = row?.offsetParent;
        if (!row || !(popup instanceof HTMLElement)) return;

        const measure = () =>
            onPeekChange(
                row.offsetTop +
                    row.offsetHeight +
                    Number.parseFloat(getComputedStyle(popup).paddingBottom),
            );
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(row);

        return () => observer.disconnect();
    };

    return (
        <Drawer
            open={node !== undefined}
            onOpenChange={(open, details) => {
                if (open) return;
                if (expanded && details?.reason === 'escape-key') {
                    onExpandedChange(false);
                } else {
                    onClose();
                }
            }}
            modal={false}
            disablePointerDismissal
            showSwipeHandle={false}
            snapPoints={[peekPoint, EXPANDED]}
            snapPoint={expanded ? EXPANDED : peekPoint}
            onSnapPointChange={(point) => onExpandedChange(point === EXPANDED)}
        >
            <DrawerContent>
                <DrawerTitle className="sr-only">Обраний тайтл</DrawerTitle>
                <button
                    type="button"
                    aria-label={expanded ? 'Згорнути' : 'Розгорнути'}
                    onClick={() => onExpandedChange(!expanded)}
                    className="absolute inset-x-0 top-0 z-10 flex h-6 cursor-pointer justify-center pt-2"
                >
                    <span className="h-1 w-10 rounded-full bg-muted" />
                </button>
                {shown && (
                    <>
                        <div ref={measurePeek}>
                            <GraphDetails
                                key={shown.id}
                                model={model}
                                node={shown}
                                variant="peek"
                                onSelect={onSelect}
                                onShow={onShow}
                            />
                        </div>
                        <GraphRelationsSection
                            key={shown.id}
                            model={model}
                            node={shown}
                            onShow={onShow}
                            scroll
                        />
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default GraphDrawer;
