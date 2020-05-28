import React, {useEffect} from "react";
import moment from "moment";
import SidePanel from "../SidePanel/SidePanel";
import {DisplayCalendar} from "./DisplayCalendar";
import styled from "styled-components";
import app from "../../firebase";
import {Button} from "@material-ui/core";
import {BlockTitle} from "../StyledComponents/BlockTitle";
import {ContainerMain} from "../StyledComponents/ContainerMain";

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
        app.database().ref(`/contactMessage/${message.key}`).remove().then(() => {
            history.push("/messages")
        });
    };

    return (
        <>
            <SidePanel/>
            <ContainerMain>
                <ContainerMessage>
                    <BlockTitle>
                        <h2>{`${message.name} ${message.firstName} `}<span> Le {moment(message.dateMessage).format('LLLL')}</span>
                        </h2>
                    </BlockTitle>
                    <BlockMessage>
                        <p>{message.message}</p>
                    </BlockMessage>
                    <DisplayCalendar dateMessage={new Date(message.dateMessage)}/>
                </ContainerMessage>
                <Button variant="contained" color="secondary"
                        onClick={handleDeleteMessage}> Supprimer</Button>
            </ContainerMain>
        </>
    )
};


const ContainerMessage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const BlockMessage = styled.div`
    margin: 0 0 0.5rem;
    border: 1px solid ${props => props.theme.colors.secondary};
    padding: 0.5rem;
`;

export default Message
