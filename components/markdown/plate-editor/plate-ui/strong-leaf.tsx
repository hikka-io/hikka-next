import { PlateLeaf, PlateLeafProps } from '@udecode/plate-common';

export default function StrongLeaf({
    className,
    children,
    ...props
}: PlateLeafProps) {
    return (
        <PlateLeaf asChild className={className} {...props}>
            <strong>{children}</strong>
        </PlateLeaf>
    );
}
