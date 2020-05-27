import React, {useEffect, useState} from "react";
import SidePanel from "../SidePanel/SidePanel";
import {Container} from "@material-ui/core";
import app from "../../firebase";
import {MessagesTables} from "./MessagesTable";
import {CircularLoadingContainer, CircularLoading} from "../StyledComponents/Loader";


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
            <Container fixed>
                {firebaseAllDataMessages !== null
                    ?
                    <MessagesTables dataMessages={firebaseAllDataMessages} setIsDeletedMessages={setIsDeletedMessages}/>
                    :
                    <p>Aucun messages</p>
                }
            </Container>
        </>
    )
};

export default Messages
