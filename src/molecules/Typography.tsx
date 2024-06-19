import React, { CSSProperties, ReactNode } from 'react';

interface TypographyProps {
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    children: ReactNode;
    color?: string;
    style?: CSSProperties;
}

const Typography: React.FC<TypographyProps> = ({ variant, color, children, style }) => {
    const Element = variant;

    return (
        <Element color={color} style={style}>
            {children}
        </Element>
    );
};

export default Typography;
