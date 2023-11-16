import './charList.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PropTypes from "prop-types";

class CharList extends Component{

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();

    // scrollCallback(offset) {
    //         let bottomReached = false;
    //         if (!bottomReached && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //             bottomReached = true;
    //             // console.log('Вы достигли низа страницы!');
    //             // console.log('Вы достигли низа страницы!', this.state);
    //             // this.onRequest(offset);
    //         } else {
    //             bottomReached = false
    //         }
    // }

    componentDidMount() {
        this.onRequest();
        // window.addEventListener('scroll', this.scrollCallback)
    }

    componentWillUnmount() {
        // window.removeEventListener('scroll', this.scrollCallback)
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({newItemLoading: true})
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    onCharListLoaded = (newCharList) => {

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading:false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: newCharList.length < 9,
        }))
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        console.log('hello suka', id)
        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
    render() {

        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const elements = charList.map((elem, index) => {
            return (
                <Character
                    setRef = {this.setRef}
                    key = {elem.id}
                    char = {elem}
                    onCharSelected={this.props.onCharSelected}
                    focusOnItem ={this.focusOnItem}
                    index={index}
                />
            )
        })

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ?
            (<ul className="char__grid">
                {elements}
            </ul>) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style ={{display: charEnded ? "none" : "block"}}
                    onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const Character = (props) => {
    const {name, thumbnail, id} = props.char
    return (
        <li className="char__item"
            ref ={props.setRef}
            onClick={() => {
                props.onCharSelected(id);
                props.focusOnItem(props.index);
            }}
            onKeyPress={(e) => {
                if (e.key === ' ' || e.key === "Enter") {
                    this.props.onCharSelected(id);
                    this.focusOnItem(props.index);
                }
            }}
            key={id}>
            <img src={thumbnail} alt="abyss"
                 style={{
                     objectFit : thumbnail==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? "unset" : ''
                 }}
            />
            <div className="char__name">{name}</div>
        </li>
    )
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;