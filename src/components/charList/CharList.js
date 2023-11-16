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
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }
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
    render() {

        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const elements = charList.map(elem => {
            return (
                <Character
                    key = {elem.id}
                    char = {elem}
                    onCharSelected={this.props.onCharSelected}
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
            onClick={() => props.onCharSelected(id)}
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