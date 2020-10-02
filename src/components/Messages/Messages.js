import React, {useEffect, useState} from "react";
import SidePanel from "../SidePanel/SidePanel";
import styled from "styled-components"
import app from "../../firebase";
import {MessagesTables} from "./MessagesTable";
import {CircularLoadingContainer, CircularLoading} from "../StyledComponents/Loader";
import {ContainerMain} from "../StyledComponents/ContainerMain";

const Messages = () => {

    const [firebaseAllDataMessages, setFirebaseAllDataMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeletedMessages, setIsDeletedMessages] = React.useState(false);

    useEffect(() => {
        const fetchDataMessages = async () => {
            try {
                setIsLoading(true);
                const dbRef = app.database().ref("/contactMessage");
                const snapshot = await dbRef.once("value");
                const value = snapshot.val();
                setFirebaseAllDataMessages(value);

                setIsDeletedMessages(false);
                setIsLoading(false);
            } catch (e) {
                console.error(e)
            }
        };
        fetchDataMessages()

    }, [isDeletedMessages]);

    if (isLoading) {
        return (
            <>
                <SidePanel/>
                <CircularLoadingContainer>
                    <CircularLoading/>
                </CircularLoadingContainer>
            </>
        )
    }

    return (
        <>
            <SidePanel/>
            <ContainerMain>
                {firebaseAllDataMessages !== null
                    ?
                    <MessagesTables dataMessages={firebaseAllDataMessages} setIsDeletedMessages={setIsDeletedMessages}/>
                    :
                    <ContainerNoMessages>
                        <p>Aucun messages</p>
                    </ContainerNoMessages>
                }
            </ContainerMain>
        </>
    )
};

const ContainerNoMessages = styled.div`
    p {
      text-align: center;
    }
`

export default Messages
