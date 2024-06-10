import { PlateLeaf, PlateLeafProps } from '@udecode/plate-common';

export default function ItalicLeaf({
    className,
    children,
    ...props
}: PlateLeafProps) {
    return (
        <PlateLeaf asChild className={className} {...props}>
            <em>{children}</em>
        </PlateLeaf>
    );
}
