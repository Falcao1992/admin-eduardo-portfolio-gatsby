import React, {useEffect, useState} from "react";
import SidePanel from "../SidePanel/SidePanel";
import app from "../../firebase";
import {CircularLoading, CircularLoadingContainer} from "../StyledComponents/Loader";
import styled from "styled-components";
import {Container, Input, Button} from "@material-ui/core";


const Banners = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [firebaseDataBanner, setFirebaseDataBanner] = useState([]);
    const [currentBannerImg, setCurrentBannerImg] = useState([]);
    const [currentImageFile, setCurrentImageFile] = useState([]);


    useEffect(() => {
        fetchDataBanner()
    }, []);

    const fetchDataBanner = async () => {
        try {
            setIsLoading(true);
            const dbRef = app.database().ref("/banners");
            const snapshot = await dbRef.once("value");
            const value = snapshot.val();
            setFirebaseDataBanner(value);

            setIsLoading(false);
        } catch (e) {
            console.error(e)
        }
    };

    const PreviewFile = (e, index) => {
        try {
            const file = e.target.files[0];
            const resultFile = [...currentImageFile];
            resultFile[index] = file;
            setCurrentImageFile(resultFile);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (event) => {
                const result = [...currentBannerImg];
                result[index] = event.target.result;
                setCurrentBannerImg(result);
            };

        } catch (error) {
            console.error(error)
        }
    };

    const submitEditBanner = (index, pageName) => {
        console.log(currentImageFile[index])
        if (currentImageFile[index] !== undefined) {
            console.log("c'est bon")
            sendData(currentImageFile[index], pageName)
        } else {
            console.log("pas de fichier")
        }
    };

    const sendData = (file, pageName) => {
        const uploadTask = app.storage().ref(`banners/${pageName}Banner`).put(file);
        uploadTask.on(`state_changed`,
            (snapshot) => {
                console.log(snapshot)
            },
            (error) => {
                console.log(error)
            },
            () => {
                app.storage().ref(`banners`).child(`${pageName}Banner`).getDownloadURL()
                    .then(url => {
                        return url
                    })
                    .then((bannerUrl) => {
                        console.log(bannerUrl);
                        app.database().ref(`banners/${pageName}`)
                            .update({
                                urlImage: bannerUrl
                            });
                        fetchDataBanner()
                    })
                    .catch(e => {
                        console.error(e)
                    })
            });
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
            <Container fixed>
                <PageBlockTitleDescription>
                    <h1>Editer les Bannières</h1>
                    <p>Veuillez choisir une nouvelle image puis cliquez sur le boutton associé afin de valider le changement de bannière :</p>
                </PageBlockTitleDescription>
                {firebaseDataBanner && Object.values(firebaseDataBanner).map((banner, index) => {
                    return (
                        <ContainerBannerPreview key={banner.uid}>
                            <p>Bannière de la page {banner.page} :</p>
                            <img src={banner.urlImage} alt={banner.page}/>
                            <Input type="file" margin='dense' required onChange={(e) => PreviewFile(e, index)}/>
                            {typeof currentBannerImg[index] === 'string'
                            &&
                                <img src={currentBannerImg[index]} alt="article"/>
                            }
                            <Button variant="contained" type="button"
                                    disabled={!currentImageFile[index]}
                                    onClick={() => submitEditBanner(index, banner.page)} color="secondary"
                                    aria-label="edit">Changer Banniere</Button>
                        </ContainerBannerPreview>
                    )
                })}
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

const ContainerBannerPreview = styled.div`
    display: flex;
    flex-direction: column;
    p {
      font-size: 1.6rem;
      text-decoration: underline;
    }
    img {
      width: 100%;
      margin: 0.5rem 0;
    }
    Button {
      margin: 0.5rem 0 2rem;
    }
`;


export default Banners
