import React, {useEffect, useState} from "react";
import SidePanel from "../SidePanel/SidePanel";
import app from "../../firebase";
import {CircularLoading, CircularLoadingContainer} from "../StyledComponents/Loader";
import styled from "styled-components";
import {Input, Button} from "@material-ui/core";
import {ContainerMain} from "../StyledComponents/ContainerMain";
import {BlockTitle} from "../StyledComponents/BlockTitle";
import {toast} from "react-toastify";

const Banners = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [firebaseDataBanner, setFirebaseDataBanner] = useState([]);
    const [currentBannerImg, setCurrentBannerImg] = useState([]);
    const [currentImageFile, setCurrentImageFile] = useState([]);

    const [isSending, setIsSending] = useState(false);

    toast.configure();

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
        if (currentImageFile[index] !== undefined) {
            setIsSending(true);
            sendData(currentImageFile[index], pageName)
        } else {
            console.log("probleme pas de fichier ")
        }
    };

    const sendData = (file, pageName) => {
        const refBanner = app.storage().ref(`banners/${pageName}Banner`);
        const uploadTask = refBanner.put(file);
        uploadTask.on(`state_changed`,
            (snapshot) => {
                console.log(snapshot)
            },
            (error) => {
                console.log(error)
            },
            () => {
                refBanner.getDownloadURL()
                    .then(url => {
                        return url
                    })
                    .then((bannerUrl) => {
                        app.database().ref(`banners/${pageName}`)
                            .update({
                                urlImage: bannerUrl
                            })
                            .then(() => {
                                toast.success('La banniere à été correctement changé!', {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true
                                });
                                setCurrentImageFile([]);
                                setCurrentBannerImg([]);
                                fetchDataBanner()
                                    .then(() => {
                                    setIsSending(false)
                                })
                            })
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
            <ContainerMain>
                <BlockTitle>
                    <h1>Editer les Bannières</h1>
                    <p>Veuillez choisir une nouvelle image puis cliquez sur le boutton associé afin de valider le changement de bannière :</p>
                </BlockTitle>
                <ContainerAllBannerPreviews>
                {firebaseDataBanner && Object.values(firebaseDataBanner).map((banner, index) => {
                    return (
                        <ContainerBannerPreview key={banner.uid}>
                            <p>Page "{banner.key}" :</p>
                            <img src={banner.urlImage} alt={banner.key}/>
                            <Input type="file" margin='dense' required onChange={(e) => PreviewFile(e, index)}/>
                            {typeof currentBannerImg[index] === 'string'
                            &&
                                <img src={currentBannerImg[index]} alt="article"/>
                            }
                            <Button variant="contained" type="button"
                                    disabled={!currentImageFile[index] || isSending}
                                    onClick={() => submitEditBanner(index, banner.key)} color="secondary"
                                    aria-label="edit">Changer Banniere</Button>
                        </ContainerBannerPreview>
                    )
                })}
                </ContainerAllBannerPreviews>
            </ContainerMain>
        </>
    )
};

const ContainerAllBannerPreviews = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const ContainerBannerPreview = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(33% - 2rem);
    @media only screen and (max-width:800px) {
        flex-direction: column;
        width: 100%;
    }
    p {
        font-size: 1.6rem;
        text-decoration: underline;
        text-align: center;
    }
    img {
        width: 100%;
        margin: 0.5rem 0;
        height: 45vh;
        object-fit: cover;
    }
    Button {
        margin: 0.5rem 0 2rem;
    }
`;


export default Banners
