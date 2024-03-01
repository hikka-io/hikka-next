import {TTypoProps} from "./type";

const typoLead = ({children, className, ...props}: TTypoProps) => {
    return (
        <p className={`text-xl text-muted-foreground ${className}`} {...props}>
            {children}
        </p>
    );
};

export default typoLead;
