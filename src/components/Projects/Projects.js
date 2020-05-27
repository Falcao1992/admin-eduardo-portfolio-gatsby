import React, {useState, useEffect} from "react"
import app from "../../firebase";
import {Link} from "react-router-dom";
import {CircularLoadingContainer, CircularLoading} from "../StyledComponents/Loader";
import {Button} from "@material-ui/core";
import SidePanel from "../SidePanel/SidePanel";
import styled from "styled-components";


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
            <div>
                <div>
                    <h1>Visionner tout mes projects</h1>
                    <p>Veuillez cliquer sur un projects pour le modifier:</p>
                </div>

                {Object.values(firebaseAllProjects).map((projects) => {
                    return (
                        <div key={projects.key}>
                            <p>{projects.name}</p>
                            <img src={projects.urlImage} alt={projects.name}/>
                        </div>
                    )
                })}

                <div>
                    <Link to="/projects/create"><Button variant="contained" color="primary">Ajouer un nouveau Projets</Button></Link>
                </div>

            </div>
        </>
    )
};

export default Projects
