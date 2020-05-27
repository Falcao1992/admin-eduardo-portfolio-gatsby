import React, {useEffect, useState} from "react"

import SidePanel from "../SidePanel/SidePanel";
import app from "../../firebase";
import styled from "styled-components";
import {CircularLoadingContainer, CircularLoading} from "../StyledComponents/Loader";
import {Link} from "react-router-dom";
import WarningIcon from '@material-ui/icons/Warning';
import moment from "moment";
import 'moment/locale/fr';
import ScheduleIcon from "@material-ui/icons/Schedule";

moment.locale('fr');

const Home = ({history}) => {
    const [dataProjects, setDataProjects] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDataProjects();
        fetchDataMessages()

    }, []);

    const fetchDataProjects = async () => {
        try {
            setIsLoading(true);
            const flattenArray = (obj, parents = []) => {
                if (typeof obj !== 'object') {
                    return []
                }
                return Object.entries(obj)
                    .flatMap(([currentItemName, value]) => {
                        if (typeof value !== 'object' && currentItemName === "urlImage") {
                            return [
                                obj
                            ]
                        }
                        return flattenArray(value, parents.concat(currentItemName))
                    })
            };
            const dbRef = app.database().ref("/projects").orderByChild('date');
            const snapshot = await dbRef.once("value");
            const dataFlat = flattenArray((snapshot.val()));
            dataFlat.sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });
            const dataFormat = dataFlat.slice(0, 8);
            setDataProjects(dataFormat)
            setIsLoading(false);
        } catch (e) {
            console.error(e)
        }
    };

    const fetchDataMessages = async () => {
        try {
            const dbRef = app.database().ref("/contactMessage").orderByChild('read').equalTo("false").limitToLast(5);
            const snapshot = await dbRef.once("value");
            const value = snapshot.val();
            setLastMessages(value);
        } catch (e) {
            console.error(e)
        }
    };

    const handleLinkToArticle = (project) => {
        localStorage.setItem("project choose", project.name);
        history.push("/projects");
    };

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
            <SectionHome>
                <TitleSection>Voir mes derniers projets :</TitleSection>
                <WrapperGridProjects>
                    {dataProjects.length !== 0 && dataProjects.map(project => {
                        return (
                            <ContainerImageGrid key={project.key} onClick={() => handleLinkToArticle(project)}>
                                <img src={project.urlImage} alt={project.key}/>
                            </ContainerImageGrid>
                        )
                    })}
                </WrapperGridProjects>
            </SectionHome>

            <SectionHome>
                <TitleSection>Mes Courriers non lus :</TitleSection>
                <WrapperMessages>
                    {lastMessages && Object.values(lastMessages).map((msg, index) => {
                        return (
                            <ContainerMessage key={index}>
                                <WarningIcon/>
                                <Link to={{
                                    pathname: `/listOneMessages/${msg.name.toLowerCase()}`,
                                    state: {message: msg}
                                }}>{`${msg.name} ${msg.firstName}`}
                                </Link>
                                <ContainerIconText>
                                    <ScheduleIcon fontSize="small"/>
                                    <p>{moment(msg.dateMessage).fromNow()}</p>
                                </ContainerIconText>
                            </ContainerMessage>
                        )
                    })}
                </WrapperMessages>
            </SectionHome>
        </>
    )
};
const ContainerMessage = styled.div`
    display: grid;
    grid-template-columns: 10% 35% 15% 40%;
    grid-gap: 2px;
    padding: 15px;
    p{
        margin-left: 0.4rem;
    }
    `;

const ContainerIconText = styled.div`
    display: flex;

    `;

const TitleSection = styled.h2`
        font-family: ${props => props.theme.fonts.primary}, sans-serif;
        padding: 15px 0;
        font-size: 1.7em;     
    `;
const SectionHome = styled.section`
        display: flex;
        flex-direction: column;      
        align-items: center;
        margin-bottom: 3rem;
    `;
const WrapperGridProjects = styled.div`
        display: grid;
        grid-template-columns: repeat(4, auto);
        grid-template-rows: 1fr 1fr;
        grid-gap: 2px;
        margin: auto;
        width: 90%; 
        padding: 1px;
        `;

const WrapperMessages = styled.div`
        margin: auto;
        width: 90%; 
        padding: 1px;
        > div {
            margin-top: 2rem;
        }     
        > div:nth-child(2n) {
            background-color: ${props => props.theme.colors.primary};
        }
        `;

const ContainerImageGrid = styled.div`
        img{          
            object-fit: cover;
            width: 100%;
            height: 100%;
            vertical-align: middle;        
        }
  `;

export default Home
