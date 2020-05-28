import styled from "styled-components";

export const BlockTitle = styled.div`
    margin: 1rem 0;
    h1 {
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
        font-family: ${props => props.theme.fonts.primary};
    }
    h2 {
        font-size: 1.5rem;
        font-family: ${props => props.theme.fonts.primary};
        padding: 1rem 0;
    }
    p {
        font-size: 1.2rem;
    }
`;
