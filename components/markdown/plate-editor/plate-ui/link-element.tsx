import { PlateElement, PlateElementProps } from '@udecode/plate-common';

export default function LinkElement({
    className,
    children,
    ...props
}: PlateElementProps) {
    return (
        <PlateElement asChild className={className} {...props}>
            <span className="text-primary hover:underline">{children}</span>
        </PlateElement>
    );
}
