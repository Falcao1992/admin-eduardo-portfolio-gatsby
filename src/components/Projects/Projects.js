import React, {useState, useEffect} from "react"
import app from "../../firebase";
import {Link} from "react-router-dom";
import {CircularLoadingContainer, CircularLoading} from "../StyledComponents/Loader";
import {Button} from "@material-ui/core";
import SidePanel from "../SidePanel/SidePanel";
import styled from "styled-components";
import {ContainerMain} from "../StyledComponents/ContainerMain";
import {BlockTitle} from "../StyledComponents/BlockTitle";


const Projects = () => {

    const [firebaseAllProjects, setFirebaseAllProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDataProjects = async () => {
            try {
                setIsLoading(true);
                const dbRef = app.database().ref("/projects");
                const snapshot = await dbRef.once("value");
                const value = snapshot.val();
                setFirebaseAllProjects(value);

                setIsLoading(false);

            } catch (e) {
                console.error(e)
            }
        };
        fetchDataProjects()

    }, []);


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
                <BlockTitle>
                    <h1>Visionner tout mes projects</h1>
                    <p>Veuillez cliquer sur un projects pour le modifier:</p>
                </BlockTitle>
                <ContainerProjects>
                    {Object.values(firebaseAllProjects).map((project) => {
                        return (
                            <BlockProject key={project.key}>
                                <Link to={{
                                    pathname: `/projects/edit/${project.key}`, state: {
                                        project
                                    }
                                }}>
                                    <BlockImage>
                                        <p>{project.name}</p>
                                        <img src={project.urlImage} alt={project.name}/>
                                    </BlockImage>
                                </Link>
                            </BlockProject>

                        )
                    })}
                </ContainerProjects>
                <div>
                    <Link to="/projects/create"><Button variant="contained" color="primary">Ajouer un nouveau
                        Projets</Button></Link>
                </div>
            </ContainerMain>
        </>
    )
};

const ContainerProjects = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 1rem;
`;

const BlockProject = styled.div`
    width: calc(25% - 0.5rem);
    margin-bottom: 0.5rem;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: middle;  
    }
`;
const BlockImage = styled.div`
    height: 100%;
`;


export default Projects
