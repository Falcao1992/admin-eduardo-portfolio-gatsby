import React from "react";
import styled from "styled-components";

const Footer = () => {
    return (
        <ContainerFooter>
            <p>Eduardo Lépine Administration</p>
        </ContainerFooter>
    )
};

const ContainerFooter = styled.footer `
    background-color: ${props => props.theme.colors.primary};
    p {
        text-align: center;
        padding: 1rem;
    }
`;

export default Footer;

