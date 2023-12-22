import './charList.scss';
import {useState, useEffect, useRef, useMemo} from "react";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PropTypes from "prop-types";

const setContent = (process, Component, newItemLoading) => {
    switch (process){
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return  <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, setProcess, process} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    },[]);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharListLoaded = (newCharList) => {

        setCharList(charList => [...charList, ...newCharList] );
        setNewItemLoading(() => false);
        setOffset(offset => offset + 9);
        setCharEnded(() => newCharList.length < 9);
    }

    const itemRefs = useRef([]);

    function renderItems(charList) {
        const focusOnItem = (id) => {
            itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
            itemRefs.current[id].classList.add('char__item_selected');
            itemRefs.current[id].focus();
        }
        return charList.map((elem, index) => {
            return (
                <Character
                    itemRefs={itemRefs}
                    key={elem.id}
                    char={elem}
                    onCharSelected={props.onCharSelected}
                    focusOnItem={focusOnItem}
                    index={index}
                />
            )
        })
    }
    const  content = renderItems(charList);

    const elements = useMemo(() => setContent(process,
        () => <ul className="char__grid">
            <TransitionGroup component={null}>
                {content}
            </TransitionGroup>
        </ul>,
        newItemLoading
    ), [process])

    return (
        <div className="char__list">
            {elements}
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