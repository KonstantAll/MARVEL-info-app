import AppHeader from "../appHeader/AppHeader";

import {useState} from "react";

import ComicsList from "../comicsList/ComicsList";

const App = () => {

    const [selectedChar, setChar] = useState(null)

    const onCharSelected = (id) => {
        setChar(id)
    }
    //
    return (
        <div className="app">
            <AppHeader/>
            <main>
                <ComicsList/>
                {/*<ErrorBoundary>*/}
                {/*    <RandomChar/>*/}
                {/*</ErrorBoundary>*/}
                {/*<div className="char__content">*/}
                {/*    <ErrorBoundary>*/}
                {/*        <CharList onCharSelected ={onCharSelected}/>*/}
                {/*    </ErrorBoundary>*/}
                {/*    <ErrorBoundary>*/}
                {/*        <CharInfo charId = {selectedChar}/>*/}
                {/*    </ErrorBoundary>*/}
                {/*</div>*/}
                {/*<img className="bg-decoration" src={decoration} alt="vision"/>*/}
            </main>
        </div>
    )

}

export default App;