import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({MyComponent, dataType}) => {
    const {id} = useParams();
    const [data, setData] = useState(null);
    const {loading, error, getComics, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateData();
    },[id]);

    const updateData = () => {
        clearError();
        switch (dataType){
            case 'comic': getComics(id).then(onDataLoaded);
            break;
            case 'character': {getCharacter(id).then(onDataLoaded);
                console.log('getCharacter')}
            break;
        }
    };

    const onDataLoaded = (data) => {
        setData(data);
    }

    const errorMessage = error ? <ErrorMessage/>:  null;
    const spinner = loading ? <Spinner/>:  null;
    const content = !(loading || error || !data) ? <MyComponent data ={data}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

export default SinglePage;