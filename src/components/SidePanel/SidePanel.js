import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";

// Import Components of Material-Ui
import {Drawer, Button, List, Divider, ListItem, ListItemText,ListItemIcon, makeStyles } from '@material-ui/core';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import CreateIcon from '@material-ui/icons/Create';
import ListIcon from '@material-ui/icons/List';
import EmailIcon from '@material-ui/icons/Email';
import styled from "styled-components";
import app from "../../firebase";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    listItem: {
        color: 'black',
        textDecoration: 'none'
    },
    link: {
        textDecoration: "none"
    }
});

const SidePanel = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [numberNewMessages, setNumberNewMessages] = useState({});

    useEffect(() => {
        const fetchDataMessages = async () => {
            try {
                const dbRef = app.database().ref("/contactMessage");
                const snapshot = await dbRef.once("value");
                const value = snapshot.val();
                const FilterNewMessages = Object.values(value).filter(msg => msg.read === "false")
                setNumberNewMessages(FilterNewMessages.length);
            } catch (e) {
                console.error(e)
            }
        };
        fetchDataMessages()

    }, []);

    const toggleDrawer = (open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const sideList = () => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <Link to="/" className={classes.link}>
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary="Page d'acceuil"/>
                    </ListItem>
                </Link>
                <Link to="/projects" className={classes.link}>
                    <ListItem button>
                        <ListItemIcon><ListIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary="Voir mes projets"/>
                    </ListItem>
                </Link>
                <Link to="/projects/create" className={classes.link}>
                    <ListItem button>
                        <ListItemIcon><CreateIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary="Ajouter un projet"/>
                    </ListItem>
                </Link>

                <Link to="/listmessages" className={classes.link}>
                    <ListItem button>
                        <ListItemIcon><EmailIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary={`Voir les messages (${numberNewMessages})`}/>
                    </ListItem>
                </Link>
                <Link to="/banner" className={classes.link}>
                    <ListItem button>
                        <ListItemIcon><EmailIcon/></ListItemIcon>
                        <ListItemText className={classes.listItem} primary="Changer les bannière"/>
                    </ListItem>
                </Link>
                <Divider/>
                <ListItem button onClick={() => app.auth().signOut()}>
                    <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                    <ListItemText primary="Se Déconnecter"/>
                </ListItem>
            </List>
        </div>
    );

    return (
        <SidePanelContainer>
            <Button variant="outlined" onClick={toggleDrawer(true)}><MenuIcon/></Button>
            <TitleSidePanel>Portfolio d'Eduardo</TitleSidePanel>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {sideList()}
            </Drawer>
        </SidePanelContainer>
    );
};

const SidePanelContainer = styled.div `
        background-color: ${props => props.theme.colors.primary};
        color: ${props => props.theme.colors.secondary};
        display: flex;
        padding: 15px 10px;
        margin-bottom: 30px;
        justify-content: space-between;
    `;

const TitleSidePanel = styled.h2 `
        font-family: ${props => props.theme.fonts.primary}, sans-serif;
        margin: 0;  
        padding-right: 5px;  
    `;

export default SidePanel;
