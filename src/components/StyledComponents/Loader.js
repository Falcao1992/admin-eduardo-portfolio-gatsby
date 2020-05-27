import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";

export const CircularLoadingContainer = styled.div`
        height: 100vh;
        display: flex;
            div {
                height: 0;
                width: 0;
                display: table;
            }
            svg{
                height: 90px;
            }
    `;

export const CircularLoading = styled(CircularProgress)`
        margin: 0 auto;
        align-self: center;
    `;
