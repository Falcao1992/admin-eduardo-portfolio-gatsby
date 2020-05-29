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

    const {projectTitle, urlImage, description, sourceNetlify, key} = currentDataEdit;
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
                <ContainerPreviews>
                    <div>
                        <TitlePreview>image actuelle :</TitlePreview>
                        <a href={urlImage} target="_blank" rel="noopener noreferrer"><img src={urlImage} alt={key}/></a>
                    </div>
                    <BlockTextPreview>
                        <TitlePreview>informations :</TitlePreview>
                        <div>
                            <h2>{projectTitle}</h2>
                            <p>Description: {description}</p>
                            <p>Lien Ntelify: {sourceNetlify}</p>
                        </div>
                    </BlockTextPreview>
                    <BlockNewImage>
                        <TitlePreview>nouvelle image :</TitlePreview>
                        {currentNewPreviewImg !== null
                            ?
                            <img src={currentNewPreviewImg} alt=" preview projects"/>
                            :
                            <div>
                                <input type="file" id="contained-button-file" required onChange={PreviewFile}/>
                                <label htmlFor="contained-button-file">
                                    <IconButton color="secondary" aria-label="upload picture" component="span">
                                        <PhotoCamera fontSize="large"/>
                                    </IconButton>
                                </label>
                            </div>
                        }
                    </BlockNewImage>
                </ContainerPreviews>

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
                        <IconButton color="secondary" aria-label="delete picture" onClick={handleDeleteProject}
                                    component="span">
                            <DeleteIcon fontSize="large"/>
                        </IconButton>
                    </ContainerButton>
                </ContainerForm>
            </ContainerMain>
        </>
    )
};

const ContainerPreviews = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 3rem;
    background-color: ${props => props.theme.colors.primary};   
    @media only screen and (max-width:800px) {
        flex-direction: column;
        padding: 0;
        background-color: initial;
    }
    > div {
        width: 30%;
        display: flex;
        flex-direction: column;
        position: relative;    
        @media only screen and (max-width:800px) {
            width: auto;
            margin: 1rem 0;
        }
    }
    img {
        max-width: 100%;
        max-height: 65vh;
        object-fit: contain;
        @media only screen and (max-width:800px) {
            width: 100%;
            max-height: 50vh;
        }
    }
`;

const TitlePreview = styled.p`
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 0.5rem;
`;

const BlockTextPreview = styled.div`
    @media only screen and (max-width:800px) {
        order: 2;
    }
    > div {
        height: 65vh;
        background-color: white;
        padding: 0.5rem;
        @media only screen and (max-width:800px) {
            border: 1px solid #00000021;
            height: 50vh;
        }
    }
`;


const BlockNewImage = styled.div `
    @media only screen and (max-width:800px) {
        order: 1;
    }
    > div {
        background-color: white;
        height: 65vh;
        border: 1px solid #00000021;
        input {
            display: none;
        }
        label {
            position: absolute;
            width: min-content;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
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
