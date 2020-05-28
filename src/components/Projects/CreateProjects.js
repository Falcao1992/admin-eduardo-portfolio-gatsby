import React, {useState} from "react";
import app from "../../firebase";
import {TextField, Input, CardMedia, IconButton} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";
import {nanoid} from 'nanoid'
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {toCamelCaseString} from "../toCamelCaseString";
import moment from "moment";
import {ContainerMain} from "../StyledComponents/ContainerMain";
import {BlockTitle} from "../StyledComponents/BlockTitle";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import SaveIcon from "@material-ui/icons/Save";

const CreateProjects = ({history}) => {

    const [currentImageProjectFile, setCurrentImageProjectFile] = useState();
    const [currentImageProject, setCurrentImageProject] = useState("");

    const [missingField, setMissingField] = useState(false);
    const [keyBeforeTransform, setKeyBeforeTransform] = useState("");

    const data = {
        projectTitle: "",
        description: "",
        date: "",
        dateUpdated: "",
        key: "",
        type: "project",
        uid: nanoid(),
        urlImage: "",
        sourceNetlify: ""
    };
    const [dataProject, setDataProject] = useState(data);
    const {projectTitle, description, key, uid, sourceNetlify} = dataProject;

    toast.configure();

    const handleChange = (e) => {
        setDataProject({...dataProject, [e.target.id]: e.target.value});
    };

    const handleChangeKey = (e) => {
        if (e.target.id === "key") {
            setKeyBeforeTransform(e.target.value);
            let value = toCamelCaseString(e.target.value);
            setDataProject({...dataProject, key: value});
        } else {
            console.log("pas key")
        }
    };

    const sendData = () => {
        let copyDataProject;
        copyDataProject = dataProject;

        if (dataProject.sourceNetlify === "") {
            dataProject.sourceNetlify = "none"
        }
        copyDataProject.date = moment().format();
        copyDataProject.dateUpdated = moment().format();

        const refProject = app.storage().ref(`projectsPicture/${key}`)
        const uploadTask = refProject.put(currentImageProjectFile);
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
                    .then((dataUpdate) => {
                        console.log(dataUpdate);
                        app.database().ref(`projects`)
                            .update({
                                [key]: dataUpdate
                            }).then(() => {
                            history.push("/projects")
                        })
                    })
                    .catch(e => {
                        console.error(e)
                    })
            });
    };

    const checkFormConform = () => {
        return new Promise(function (resolve, reject) {
            if (projectTitle !== "" && description !== "" && key !== "" && currentImageProject !== "") {
                toast.success('Votre projet à été correctement creé!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                sendData();
                setMissingField(false);
                resolve("résolu")
            } else {
                toast.error('Veuillez remplir tout les chanps svp !', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                setMissingField(true);
                reject('pas résolu')
            }
        });
    };

    const onSubmit = () => {
        checkFormConform();
    };

    const PreviewFile = (e) => {
        try {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (event) => {
                setCurrentImageProject(() => event.target.result)
            };
            setCurrentImageProjectFile(file);
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <>
            <SidePanel/>
            <ContainerMain>
                <BlockTitle>
                    <h1>Ajouter un nouveau Projet</h1>
                    <p>veuillez remplir tout les champs non grisé svp :</p>
                </BlockTitle>
                <FormStyled autoComplete="off">
                    <TextFieldStyled
                        onChange={handleChange}
                        value={projectTitle}
                        id="projectTitle"
                        label="Titre du Projet*"
                        variant="outlined"
                        helperText={missingField && projectTitle === "" ? <small>veuillez remplir ce
                            champ</small> : projectTitle !== "" && missingField ?
                            <CorrectField>bien rempli*</CorrectField> : false}
                        error={missingField && projectTitle === "" && true}

                    />

                    <TextFieldStyled onChange={handleChange}
                                     value={description}
                                     multiline rowsMax="6"
                                     id="description"
                                     label="description*"
                                     variant="outlined"
                                     helperText={missingField && description === "" ? "veuillez remplir ce champ" : description !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && description === "" && true}
                    />

                    <TextFieldStyled onChange={handleChange}
                                     value={sourceNetlify}
                                     multiline rowsMax="2"
                                     id="sourceNetlify"
                                     label="sourceNetlify (falcutatif)"
                                     variant="outlined"
                    />

                    <TextFieldStyled onChange={handleChangeKey}
                                     value={keyBeforeTransform}
                                     id="key"
                                     label="Key*"
                                     variant="outlined"
                                     helperText={missingField && key === "" ? "veuillez remplir ce champ" : key !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && key === "" && true}
                    />

                    <TextFieldStyled value={key}
                                     disabled
                                     id="key"
                                     label="key final"
                                     variant="outlined"
                    />

                    <TextFieldStyled value={uid}
                                     disabled
                                     multiline
                                     rowsMax="4"
                                     id="uid"
                                     label="uid"
                                     variant="outlined"
                    />

                    {/*<Input type="file"
                           margin='dense'
                           onChange={PreviewFile}
                           error={missingField && currentImageProject === "" && true}/>*/}

                    <Input type="file"
                           id="contained-button-file"
                           required
                           onChange={PreviewFile}
                    />

                    <ContainerButton>
                        <label htmlFor="contained-button-file">
                            <IconButton color="secondary" aria-label="upload picture" component="span">
                                <PhotoCamera fontSize="large"/>
                            </IconButton>
                        </label>

                        <IconButton color="primary" aria-label="save project" onClick={onSubmit}>
                            <SaveIcon fontSize="large"/>
                        </IconButton>
                    </ContainerButton>

                    {currentImageProject !== "" &&
                    <CardMediaStyled title="Image du projet" alt="projet">
                        <img src={currentImageProject} alt="projet"/>
                    </CardMediaStyled>
                    }

                </FormStyled>
            </ContainerMain>
        </>
    )
};

const CorrectField = styled.small`
    color: green
`;


const FormStyled = styled.form`
    display: flex;
    flex-direction: column;        
    input {
        margin-bottom: 15px;     
    }
    input:last-child {
        display: none;
    }
`;

const TextFieldStyled = styled(TextField)`
    margin-bottom: 15px !important;                     
`;

const CardMediaStyled = styled(CardMedia)`
    img {
        width: 100%;
    }
`;

const ContainerButton = styled.div`
    display: flex;
    justify-content: space-evenly;
    button {
        margin: 0;
    }
`;

export default CreateProjects
