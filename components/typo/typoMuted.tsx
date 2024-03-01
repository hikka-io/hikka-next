import {TTypoProps} from "./type";

const typoMuted = ({children, className, ...props}: TTypoProps) => {
    return (
        <p className={`text-sm text-muted-foreground ${className}`} {...props}>
            {children}
        </p>
    );
};

export default typoMuted;
