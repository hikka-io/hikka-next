import {TTypoProps} from "./type";

const typoH3 = ({children, className, ...props}: TTypoProps) => {
    return (
        <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`} {...props}>
            {children}
        </h3>
    );
};

export default typoH3;
