import React, {useEffect, useState} from "react";
import app from "../../firebase";
import {TextField, IconButton} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";

import moment from "moment";
import {ContainerMain} from "../StyledComponents/ContainerMain";
import {BlockTitle} from "../StyledComponents/BlockTitle";
import {toast} from "react-toastify";

const EditProjects = ({location, history}) => {
    const [currentDataEdit, setCurrentDataEdit] = useState({});
    const [currentNewPreviewImg, setCurrentNewPreviewImg] = useState(null);
    const [currentNewPreviewFile, setCurrentNewPreviewFile] = useState(null);

    const {projectTitle, urlImage, type, description, sourceNetlify, key} = currentDataEdit;
    const {project} = location.state;
    toast.configure();

    useEffect(() => {
        setCurrentDataEdit(project)
    }, [project]);

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
                .then(() => history.push("/projects"));
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
                            })
                            .then(() => {
                                history.push("/projects");
                            });
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

    const handleDeleteProject = () => {
        const imageStorage = app.storage().ref(`projectsPicture/${key}`);

        imageStorage.delete()
            .then(() => {
                toast.success(`Le Projects '${key}' à été correctement supprimé !!!`, {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            })
            .catch((error) => {
                console.error(error)
            });
        app.database().ref(`/projects/${key}`)
            .remove()
            .then(() => {
                history.push("/projects")
            })
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
                    <img src={urlImage} alt={key}/>
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
                    <ContainerButton>
                        <input type="file" id="contained-button-file" required onChange={PreviewFile}/>
                        <label htmlFor="contained-button-file">
                            <IconButton color="secondary" aria-label="upload picture" component="span">
                                <PhotoCamera fontSize="large"/>
                            </IconButton>
                        </label>
                        <IconButton color="primary" aria-label="save picture" onClick={submitEdit} component="span">
                            <SaveIcon fontSize="large"/>
                        </IconButton>
                        <IconButton color="secondary" aria-label="delete picture" onClick={handleDeleteProject} component="span">
                            <DeleteIcon fontSize="large"/>
                        </IconButton>
                    </ContainerButton>
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

const ContainerButton = styled.div`
    display: flex;
    justify-content: space-evenly;
`;


export default EditProjects
