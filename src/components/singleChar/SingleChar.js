import {Link} from "react-router-dom";
import './singleChar.scss'
import {Helmet} from "react-helmet";
const SingleChar = ({data}) => {
    const {title, description, thumbnail} = data;
    console.log('data', data)
    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name = "description"
                    content = {`${data.name} character page`}
                />
                <title>{data.name}</title>
            </Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleChar;
