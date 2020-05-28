import React, {useEffect, useState} from "react";
import app from "../../firebase";
import {Button, Container, Input, TextField, IconButton} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";

import moment from "moment";
import {ContainerMain} from "../StyledComponents/ContainerMain";
import {BlockTitle} from "../StyledComponents/BlockTitle";

const EditProjects = ({location, history}) => {
    const [currentDataEdit, setCurrentDataEdit] = useState({});
    const [currentNewPreviewImg, setCurrentNewPreviewImg] = useState(null);
    const [currentNewPreviewFile, setCurrentNewPreviewFile] = useState(null);

    const {projectTitle, urlImage, type, description, sourceNetlify} = currentDataEdit;
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

    const submitEdit = (e) => {
        e.preventDefault();
        if (currentNewPreviewFile !== null) {
            sendData(currentNewPreviewFile, currentDataEdit.key);
            console.log("send data")
        } else {
            app.database().ref(`projects/`)
                .update({
                    [currentDataEdit.key]: currentDataEdit
                })
                .then(() => history.push("/projects"))
            console.log("pas de fichier, mais sauvegarde des autre champ renseigné")
        }
    };

    const sendData = (file, projectKey) => {
        let copyDataProject = currentDataEdit;
        copyDataProject.dateUpdated = moment().format();
        const refProject = app.storage().ref(`projectsPicture/${projectKey}`);
        const uploadTask = refProject.put(file);
        uploadTask.on(`state_changed`,
            (snapshot) => {
                console.log(snapshot)
            },
            (error) => {
                console.log(error)
            },
            () => {
                refProject.getDownloadURL()
                    .then(url => {
                        copyDataProject.urlImage = url;
                        return copyDataProject
                    })
                    .then((dataUpdated) => {
                        app.database().ref(`projects/`)
                            .update({
                                [projectKey]: dataUpdated
                            });
                        history.push("/projects");
                    })
                    .catch(e => {
                        console.error(e)
                    })
            });
    };

    const PreviewFile = (e) => {
        try {
            const file = e.target.files[0];
            setCurrentNewPreviewFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (event) => {
                const result = event.target.result;
                setCurrentNewPreviewImg(result);
            };

        } catch (error) {
            console.error(error)
        }
    };

    const filterDataDisplay = (item) => {
        if (item[0] === "projectTitle" || item[0] === "sourceNetlify" || item[0] === "description") {
            return item
        }
    };


    return (
        <>
            <SidePanel/>
            <ContainerMain>
                <BlockTitle>
                    <h1>Editer un projet existant</h1>
                    <p>veuillez remplir tout les champs non grisé svp :</p>
                </BlockTitle>
                <ContainterPreview>
                    <img src={urlImage} alt={projects.key}/>
                    <h2>{projectTitle}</h2>
                    <p>Type: {type}</p>
                    <p>Description: {description}</p>
                    <p>Lien Ntelify: {sourceNetlify}</p>
                </ContainterPreview>
                <ContainerForm>
                    {currentDataEdit && Object.entries(currentDataEdit).filter(filterDataDisplay).map((value, index) => {
                        return (
                            <div key={index}>
                                <TextFieldStyled
                                    onChange={(e) => handleEditData(e, value[0])}
                                    multiline rowsMax="6"
                                    variant="outlined"
                                    required
                                    label={value[0]}
                                    defaultValue={value[1]}
                                />
                            </div>
                        )
                    })}
                    {currentNewPreviewImg !== null
                    &&
                    <img src={currentNewPreviewImg} alt=" preview projects"/>
                    }
                    <div>
                        <input type="file" id="contained-button-file" required onChange={PreviewFile}/>
                        <label htmlFor="contained-button-file">
                            <IconButton color="secondary" aria-label="upload picture" component="span">
                                <PhotoCamera/>
                            </IconButton>
                        </label>
                        <IconButton color="primary" aria-label="save picture" onClick={(e) => submitEdit(e)} component="span">
                            <SaveIcon/>
                        </IconButton>
                    </div>
                </ContainerForm>
            </ContainerMain>
        </>
    )
};

const ContainterPreview = styled.div`
    img {
        width: 100%;
    }
`;

const ContainerForm = styled.div`
    margin-top: 2rem;
    padding-top: 1rem;
    img {
        width: 100%;
    }
    input {
        display: none;
    }
`;


const TextFieldStyled = styled(TextField)`
    width: 100%;
    margin-bottom: 15px !important;  
`;


export default EditProjects
