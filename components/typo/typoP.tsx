import {TTypoProps} from "./type";

const typoP = ({children, className, ...props}: TTypoProps) => {
    return (
        <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`} {...props}>
            {children}
        </p>
    );
};

export default typoP;
