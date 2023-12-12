import './charList.scss';
import {useState, useEffect, useRef} from "react";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PropTypes from "prop-types";

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);


    const {loading, error, getAllCharacters} = useMarvelService();



    useEffect(() => {
        onRequest(offset, true);
    },[]);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded);

    }

    const onCharListLoaded = (newCharList) => {

        setCharList(charList => [...charList, ...newCharList] );
        setNewItemLoading(() => false);
        setOffset(offset => offset + 9);
        setCharEnded(() => newCharList.length < 9);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const elements = charList.map((elem, index) => {
        return (
            <Character
                itemRefs = {itemRefs}
                key = {elem.id}
                char = {elem}
                onCharSelected={props.onCharSelected}
                focusOnItem ={focusOnItem}
                index={index}
            />
        )
    })

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const content =
        (<ul className="char__grid">
            <TransitionGroup component={null}>
                {elements}
            </TransitionGroup>
        </ul>);

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style ={{display: charEnded ? "none" : "block"}}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

const Character = (props) => {
    const {name, thumbnail, id} = props.char
    return (
        <CSSTransition key={id} timeout={500} className="char__item">
            <li
                ref ={el => props.itemRefs.current[props.index] = el}
                onClick={() => {
                    props.onCharSelected(id);
                    props.focusOnItem(props.index);
                }}
                // onKeyPress={(e) => {
                //     if (e.key === ' ' || e.key === "Enter") {
                //         props.onCharSelected(id);
                //         props.focusOnItem(props.index);
                //     }
                // }}
                key={id}>
                <img src={thumbnail} alt="abyss"
                     style={{
                         objectFit : thumbnail==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? "unset" : ''
                     }}
                />
                <div className="char__name">{name}</div>
            </li>
        </CSSTransition>
    )
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;