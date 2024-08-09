import React, {createContext, useContext, useReducer} from "react";

const GlobalContext = createContext();

const baseUrl = "https://api.jikan.moe/v4";



//actions
const LOADING = "LOADING";
const SEARCH = "SEARCH";
const GET_POPULAR_ANIME = "GET_POPULAR_ANIME";
const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME";
const GET_AIRING_ANIME = "GET_AIRING_ANIME";

//reducer
const reducer = (state, action) => {
    switch(action.type){
        case LOADING:
            return{...state, loading: true}
        case GET_POPULAR_ANIME:
            return{...state, popularAnime: action.payload, loading: false}
        case SEARCH:
            return {...state, searchResults: action.payload, searchResultsCount: action.payload.length, loading: false}
        case GET_UPCOMING_ANIME:
            return{...state, upcomingAnime: action.payload, loading: false}
        case GET_AIRING_ANIME:
            return{...state, airingAnime: action.payload, loading: false}
        default:
            return state;
    }
}

export const GlobalContextProvider = ({children}) => {

    const intialState = {
        popularAnime: [],
        upcomingAnime: [],
        airingAnime: [],
        isSearch: false,
        searchResults: [],
        searchResultsCount: 0,
        loading: false, 
    }

    const [state, dispatch] = useReducer(reducer, intialState);
    const [search, setSearch] = React.useState('');


    //handle change
    const handleChange = (e) => {
        setSearch(e.target.value);
        if(e.target.value === ''){
            state.isSearch = false;
        }
    }

    //handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if(search){
            searchAnime(search);
            state.isSearch = true;
        }else{
            state.isSearch = false;
            alert('Please enter a search term')
        }
    }

    const getIntialAnime = async () => {
        dispatch({type: LOADING})
        state.isSearch = false;
        const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
        const data = await response.json();
        dispatch({type: GET_POPULAR_ANIME, payload: data.data});
    };

    const getPopularAnime = async () => {
        dispatch({type: LOADING})
        state.isSearch = false;
        const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
        const data = await response.json();
        dispatch({type: GET_POPULAR_ANIME, payload: data.data});
    };

    const getUpcomingAnime = async () => {
        dispatch({type: LOADING})
        state.isSearch = false;
        const response = await fetch(`${baseUrl}/top/anime?filter=upcoming`);
        const data = await response.json();
        dispatch({type: GET_UPCOMING_ANIME, payload: data.data});
    };

    const getAiringAnime = async () => {
        dispatch({type: LOADING})
        state.isSearch = false;
        const response = await fetch(`${baseUrl}/top/anime?filter=airing`);
        const data = await response.json();
        dispatch({type: GET_AIRING_ANIME, payload: data.data});
    };

    const searchAnime = async (anime) => {
        dispatch({type: LOADING})
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${anime}&order_by=popularity&sort=asc&sfw`);
        const data = await response.json();
        dispatch({type: SEARCH, payload: data.data});
    }

    //intial render 
    React.useEffect(() => {
        getIntialAnime();
    }, [])

    return(
        <GlobalContext.Provider value={{
            ...state,
            handleChange,
            handleSubmit,
            searchAnime,
            search,
            getPopularAnime,
            getUpcomingAnime,
            getAiringAnime
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}