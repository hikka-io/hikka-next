import { cn } from '@/utils';

interface Props {
    className?: string;
    thickness?: number;
    radius?: number;
    value: number;
    children: React.ReactNode;
    style?: React.CSSProperties;
    role?: string;
    containerClassName?: string;
}

const Component = ({
    className,
    containerClassName,
    thickness = 10,
    radius = 40,
    value,
    children,
    style,
    role = 'progressbar',
}: Props) => {
    return (
        <div className={cn("relative w-24 h-24", containerClassName)} role={role}>
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-secondary stroke-current"
                    strokeWidth={thickness || 10}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                ></circle>
                <circle
                    className={cn(
                        'text-primary progress-ring__circle stroke-current',
                        className,
                    )}
                    style={style}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    strokeDasharray={
                        !Number.isNaN(value)
                            ? `${2 * Math.PI * radius * (value / 100)}, ${
                                  2 * Math.PI * radius * (1 - value / 100)
                              }`
                            : `0, ${2 * Math.PI * radius}`
                    }
                ></circle>
                <text
                    className="fill-foreground text-base font-bold font-display"
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    dominantBaseline="middle"
                >
                    {children}
                </text>
            </svg>
        </div>
    );
};

export default Component;
