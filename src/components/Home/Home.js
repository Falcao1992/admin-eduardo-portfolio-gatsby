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
import {ContainerMain} from "../StyledComponents/ContainerMain";

moment.locale('fr');

const Home = () => {
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
            setDataProjects(dataFormat);
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

            <SectionHome>
                <h2>Voir mes derniers projets :</h2>
                <WrapperProjects>
                    {dataProjects.length !== 0 && dataProjects.map(project => {
                        return (
                                <ContainerImageGrid key={project.key}>
                                    <Link to={{
                                        pathname: `/projects/edit/${project.key}`, state: {
                                                project
                                            }}}>
                                    <img src={project.urlImage} alt={project.key}/>
                                    </Link>
                                </ContainerImageGrid>
                        )
                    })}
                </WrapperProjects>
            </SectionHome>

            <SectionHome>
                <h2>Mes Courriers non lus :</h2>
                <WrapperMessages>
                    {lastMessages && Object.values(lastMessages).map((msg, index) => {
                        return (
                            <ContainerMessage key={index}>
                                <WarningIcon/>
                                <Link to={{
                                    pathname: `/message/${msg.name.toLowerCase()}`,
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
        </ContainerMain>
        </>
    )
};

const SectionHome = styled.section`
    display: flex;
    flex-direction: column;      
    margin-bottom: 3rem;      
`;

const WrapperProjects = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const ContainerImageGrid = styled.div`
    width: calc(25% - .5rem);
    margin: 0 .25rem .25rem;
    img {          
        object-fit: cover;
        width: 100%;
        height: 100%;
        vertical-align: middle;        
    }
  `;

const WrapperMessages = styled.div`
    > div:nth-child(2n) {
        background-color: ${props => props.theme.colors.primary};
    }
`;

const ContainerMessage = styled.div`
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    a {
        margin: 0 1rem;
    }
    p {
        margin-left: .4rem;
    }
`;

const ContainerIconText = styled.div`
    display: flex;
`;

export default Home
