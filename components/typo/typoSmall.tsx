import {TTypoProps} from "./type";

const typoSmall = ({children, className, ...props}: TTypoProps) => {
    return (
        <small className={`text-sm font-medium leading-none ${className}`} {...props}>
            {children}
        </small>
    );
};

export default typoSmall;
