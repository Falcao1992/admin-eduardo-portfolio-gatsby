import React, {useCallback, useContext} from "react";
import {withRouter, Redirect} from "react-router";
import app from "../../firebase";
import {AuthContext} from "../Auth";
import {Input, Button} from '@material-ui/core';
import styled from "styled-components";

const Login = ({history}) => {
    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const {email, password} = event.target.elements;
            try {
                await app
                    .auth()
                    .signInWithEmailAndPassword(email.value, password.value);
                history.push("/");
            } catch (error) {
                alert(error);
            }
        },
        [history]
    );

    const currentUser = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/"/>;
    }

    return (
        <ContainerLogin>
            <ContainerBlockLogin>
                <h1>Se connecter</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <Input name="email" type="email" placeholder="Email"/>
                    </div>
                    <div>
                        <Input name="password" type="password" autoComplete="on" placeholder="Password"/>
                    </div>
                    <div>
                        <Button variant="contained" color="primary" type="submit">Se connecter</Button>
                    </div>
                </form>
            </ContainerBlockLogin>
        </ContainerLogin>
    );
};

const ContainerLogin = styled.div`
        display: flex;
        background-color: #ddefff;
        justify-content: center;
        flex-direction: column;
        height: 100vh;  
        padding: 0 10%;
    `;
const ContainerBlockLogin = styled.div`
        background-color: #726dbc75;
        padding: 70px 50px;   
            h1 {
                margin-bottom: 35px;
                font-size: 1.5em;
                text-transform: uppercase;
            } 
            div {
              margin-bottom: 15px;
              width: 100%;
            }     
            Button {
              width: 100%;
            }
    `;

export default withRouter(Login);
