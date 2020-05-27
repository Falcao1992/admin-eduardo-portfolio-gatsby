import React, {useState} from "react";
import app from "../../firebase";
import {Button, TextField, Container, Input, CardMedia} from "@material-ui/core";
import styled from "styled-components";
import SidePanel from "../SidePanel/SidePanel";
import {nanoid} from 'nanoid'
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {toCamelCaseString} from "../GlobalFunction";
import moment from "moment";

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
        if(dataProject.sourceNetlify === ""){
            dataProject.sourceNetlify = "none"
        }
        dataProject.date = moment().format();
        dataProject.dateUpdated = moment().format();

        const uploadTask = app.storage().ref(`projectsPicture/${key}`).put(currentImageProjectFile);
        uploadTask.on(`state_changed`,
            (snapshot) => {
                console.log(snapshot)
            },
            (error) => {
                console.log(error)
            },
            () => {
                app.storage().ref(`projectsPicture`).child(key).getDownloadURL()
                    .then(url => {
                        copyDataProject = dataProject;
                        dataProject.urlImage = url;
                        return copyDataProject
                    })
                    .then((dataUpdate) => {
                        console.log(dataUpdate);
                        app.database().ref(`projects`)
                            .update({
                                [key]: dataUpdate
                            });
                        history.push("/projects");
                    })
                    .catch(e => {
                        console.error(e)
                    })
            });
    };

    const checkFormConform = () => {
        return new Promise(function (resolve, reject) {
            if (projectTitle !== "" && description !== "" && key !== "" && currentImageProject !== "") {
                console.log("tout est rempli merci");
                toast.success('🦄 votre projet à été correctement creé!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                sendData();
                setMissingField(false);
                resolve("resolu")
            } else {
                toast.error('🦄 veuillez remplir tout les chanps svp !', {
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

    const onSubmit = async () => {
        const result = await checkFormConform();
        console.log(result)
    };

    const PreviewFile = (e) => {
        try {
            const file = e.target.files[0];
            console.log(file, "file")
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
            <Container fixed>
                <PageBlockTitleDescription>
                    <h1>Creer un nouvel article</h1>
                    <p>veuillez remplir tout les champs non grisé svp :</p>
                </PageBlockTitleDescription>

                <FormStyled autoComplete="off">
                    <TextFieldStyled onChange={handleChange} value={projectTitle} required id="projectTitle"
                                     label="projectTitle" variant="outlined"
                                     helperText={missingField && projectTitle === "" ? <small>veuillez remplir ce
                                         champ</small> : projectTitle !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && projectTitle === "" && true}

                    />

                    <TextFieldStyled onChange={handleChange} value={description} required multiline rowsMax="6"
                                     id="description" label="description" variant="outlined"
                                     helperText={missingField && description === "" ? "veuillez remplir ce champ" : description !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && description === "" && true}
                    />

                    <TextFieldStyled onChange={handleChange} value={sourceNetlify} multiline rowsMax="2"
                                     id="sourceNetlify" label="sourceNetlify (falcutatif)" variant="outlined"
                    />


                    <TextFieldStyled onChange={handleChangeKey} value={keyBeforeTransform} required id="key"
                                     label="Key"
                                     variant="outlined"
                                     helperText={missingField && key === "" ? "veuillez remplir ce champ" : key !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && key === "" && true}
                    />

                    <TextFieldStyled value={key} disabled id="key" label="key final"
                                     variant="outlined"
                                     helperText={missingField && key === "" ? "veuillez remplir ce champ" : key !== "" && missingField ?
                                         <CorrectField>bien rempli*</CorrectField> : false}
                                     error={missingField && key === "" && true}
                    />

                    <TextFieldStyled value={uid} disabled multiline rowsMax="4" id="uid" label="uid"
                                     variant="outlined"
                    />

                    <Input type="file" margin='dense' required onChange={PreviewFile}
                           error={missingField && currentImageProject === "" && true}/>
                    {currentImageProject !== "" &&
                    <CardMediaStyled title="Image de l'article" alt="article">
                        <img src={currentImageProject} alt="article"/>
                    </CardMediaStyled>
                    }

                    <ButtonCreate variant="contained" type="button" onClick={onSubmit} color="primary"
                                  aria-label="edit">create</ButtonCreate>
                </FormStyled>
            </Container>
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

const CorrectField = styled.small`
          color: green
    `;

const ButtonCreate = styled(Button)`
          margin-top: 15px !important;
    `;

const FormStyled = styled.form`
        display: flex;
        flex-direction: column;        
         input {
             margin-bottom: 15px;
         }
        `;


const TextFieldStyled = styled(TextField)`
        width: 100%;
        margin-bottom: 15px !important;                     
    `;

const CardMediaStyled = styled(CardMedia)`
            img {
              width: 100%;
            }
    `;

export default CreateProjects
