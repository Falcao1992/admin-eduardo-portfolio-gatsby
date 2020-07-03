import React from "react";
import styled from "styled-components";

const Footer = () => {
    return (
        <ContainerFooter>
            <p>salut je suis le footer</p>
        </ContainerFooter>
    )
};

const ContainerFooter = styled.div `
    background-color: ${props => props.theme.colors.primary};
`;

export default Footer;

