import { PlateElement, PlateElementProps } from '@udecode/plate-common';

export default function SpoilerElement({
    className,
    children,
    ...props
}: PlateElementProps) {
    return (
        <PlateElement asChild className={className} {...props}>
            <div className="mb-4 rounded-md border border-secondary/60 bg-secondary/30 p-2">
                {children}
            </div>
        </PlateElement>
    );
}
