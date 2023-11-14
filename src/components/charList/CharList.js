import './charList.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharList extends Component{

    state = {
        charList: [],
        loading: true,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateList()
    }

    updateList = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    onCharListLoaded = (charList) => {
        this.setState({charList, loading:false})
    }

    render() {

        const {charList, loading, error} = this.state;
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
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const Character = (props) => {                      // here I can write {char}
    const {name, thumbnail, id} = props.char            // so here I will write just char
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

export default CharList;