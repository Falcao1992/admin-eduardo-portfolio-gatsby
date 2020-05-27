import React, {useEffect, useState} from "react";
import app from "../../firebase";
import {Button, Container, TextField} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";

import moment from "moment";

const EditProjects = ({location, history}) => {
    const [currentDataEdit, setCurrentDataEdit] = useState({});
    const {projects} = location.state;

    useEffect(() => {
        setCurrentDataEdit(projects)
    }, [projects]);

    const handleEditData = (e, label) => {
        if (typeof currentDataEdit === 'object') {
            const inputVal = e.target.value;
            const result = {...currentDataEdit};
            result[label] = inputVal;
            setCurrentDataEdit(result)
        }
    };

    const submitEdit = (e,key) => {
        e.preventDefault();
        currentDataEdit.dateUpdated = moment().format();
        app.database().ref(`/projects`)
            .update({
                [key]: currentDataEdit
            });
        history.push("/projects");
    };

    return (
        <>
            <SidePanel/>
            {currentDataEdit && [currentDataEdit].map((project) => {
                const {projectTitle, urlImage, type, description, sourceNetlify} = currentDataEdit;
                return (
                    <Container fixed>
                        <PageBlockTitleDescription>
                            <h1>Editer un projet existant</h1>
                            <p>veuillez remplir tout les champs non grisé svp :</p>
                        </PageBlockTitleDescription>
                        <div>
                            <div>
                                <h2>{projectTitle}</h2>
                                <p>{type}</p>
                                <p>{description}</p>
                                <p>{sourceNetlify}</p>
                                <img src={urlImage} alt={projects.key}/>
                            </div>
                        </div>
                        {currentDataEdit && Object.entries(currentDataEdit).map((value, index) => {
                            return (
                                <div key={index}>
                                    <TextFieldStyled
                                        disabled={(value[1] === "project" || value[0] === "key" || value[0] === "uid" || value[0] === "urlImage" || value[0] === "date" || value[0] === "dateUpdated") && true}
                                        onChange={(e) => handleEditData(e, value[0])}
                                        multiline rowsMax="6"
                                        required label={value[0]}
                                        defaultValue={value[1]}
                                    />
                                </div>
                            )})}
                        <div>
                            <Button variant="contained" color="primary" onClick={(e) => submitEdit(e,project.key) }> sauvegarder changement</Button>
                        </div>
                    </Container>
                )
            })}

        </>
    )
};
const PageBlockTitleDescription = styled.div`
        margin-bottom: 20px;
        h1 {
        font-family: ${props => props.theme.fonts.primary}, sans-serif;
        font-size: 1.7em;     
        }      
    `;

const TextFieldStyled = styled(TextField)`
        width: 100%;
        margin-bottom: 15px !important;  
    `;


export default EditProjects
