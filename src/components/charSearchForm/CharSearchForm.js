
import {Field, Form, Formik, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import {useState} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import {Link} from "react-router-dom";
import './CharSearchForm.scss'

const CharSearchForm = () => {

    const [char, setChar] = useState(null);
    const {error, getCharacterByName, clearError} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        console.log('name', name)
        clearError();
        getCharacterByName(name)
            .then(onCharLoaded)
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    const results = !char ? null : char.length > 0 ?
        <div className={'char__search-wrapper'}>
            <div className={'char__search-success'}>There is! Visit {char[0].name} page?</div>
            <Link to={`/characters/${char[0].id}`}>
                <div className={'inner'}>To page</div>
            </Link>
        </div> :
        <div className={'char__search-error'}>
            The character was not found. Check the name and try again
        </div>

    return (
        <div className={'char__search-form'}>
            <Formik initialValues={
                {
                    charName: '',
                }}
                    onSubmit={({charName}) => updateChar(charName)}
                    validationSchema={Yup.object({
                        charName: Yup.string().required('This field is required'),
                    })}>
                <Form>
                    <label className={'char__search-label'} htmlFor={'charName'}>Or find a character by name:</label>
                    <div className={'char__search-wrapper'}>
                        <Field name = 'charName'
                               id= {'name'}
                               as={'input'}
                               placeholder={'Enter value'}/>
                        <button type='submit'
                                className={'button button__main'}>
                            <div className={'inner'}>Отправить</div></button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharSearchForm;