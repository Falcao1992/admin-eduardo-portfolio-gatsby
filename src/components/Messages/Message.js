import React, {useEffect} from "react";
import moment from "moment";
import SidePanel from "../SidePanel/SidePanel";
import {DisplayCalendar} from "./DisplayCalendar";
import styled from "styled-components";
import app from "../../firebase";
import {Button} from "@material-ui/core";

const Message = ({location, history}) => {
    const {message} = location.state;

    useEffect(() => {
        handleIsRead()
    });

    const handleIsRead = () => {
        app.database().ref(`/contactMessage/${message.key}`)
            .update({
                read: "true"
            });
    };

    const handleDeleteMessage = () => {
        app.database().ref(`/contactMessage/${message.key}`).remove().then(() => {history.push("/messages")});
        console.log(message.key)
    };

    return (
        <>
            <SidePanel/>
            <ContainerOneMessage>
                <BlockTitle>
                    <h3>{`${message.name} ${message.firstName} `}<span> Le {moment(message.dateMessage).format('LLLL')}</span></h3>
                </BlockTitle>
                <BlockMessage>
                    <p>{message.message}</p>
                </BlockMessage>
                <DisplayCalendar dateMessage={new Date(message.dateMessage)}/>
            </ContainerOneMessage>
            <Button variant="contained" color="secondary"
                    onClick={handleDeleteMessage}> Supprimer</Button>
        </>
    )
};

const BlockTitle = styled.div`
    h3 {
        font-family: ${props => props.theme.fonts.primary};
        font-size: 1.3rem;
        margin-bottom: 0.3rem;
    }
    
    span {
        font-size: 0.8rem;
    }
`

const ContainerOneMessage = styled.div`
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const BlockMessage = styled.div`
    margin: 1rem 0;
    border: 1px solid ${props => props.theme.colors.secondary};
    padding: 0.5rem;
`

export default Message
