import React from 'react'
import { useGlobalContext } from '../context/global'
import Popular from './PopularAnime'
import styled from 'styled-components'
import Upcoming from './UpcomingAnime'
import Airing from './AiringAnime'
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay';

function HomePage() {


  const { handleChange, 
          handleSubmit, 
          search, 
          searchAnime,
          getUpcomingAnime,
          getAiringAnime, 
          getPopularAnime,
          searchResultsCount,
          isSearch
        } = useGlobalContext()

      
  const [rendered, setRendered] = React.useState('popular')
  const [loading, setLoading] = React.useState(false)
  
  const switchComponent = () => {
    switch(rendered){
      case 'popular':
        return <Popular rendered={rendered} />
      case 'airing':
        return <Airing rendered={rendered} />
      case 'upcoming':
        return <Upcoming rendered={rendered} />
      default:
        return <Popular rendered={rendered} /> 
    }
  }

  const navigate = useNavigate();
  
  React.useEffect(() => {
    setLoading(true); 
    getPopularAnime()
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  const getTitle = () => {
    if (isSearch) {
      return `Search Results for "${search}"`;
    }
    switch (rendered) {
      case 'airing':
        return 'Airing Anime';
      case 'upcoming':
        return 'Upcoming Anime';
      default: // 'popular'
        return 'Popular Anime';
    }
  };

  const handleButtonClick = (action) => {
    setLoading(true); // Show loading spinner
    action();
    setTimeout(() => {
      setLoading(false); 
    }, 800); // Adjust delay
  };

  const handleMangaClick = () => {
      navigate('/manga');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true); 
    handleSubmit(e); 
    setTimeout(() => {
      setLoading(false); 
    }, 1500); 
  };

  return (
    <HomePageStyled>
      {loading && <LoadingOverlay />}
      <header>
        <div className="logo">
          <h1>{getTitle()}</h1>
        </div>
        <div className="search-container">
        <div className="filter-btn popular-filter">
          <button onClick={() => handleButtonClick(() => {
            setRendered('popular');
            getPopularAnime();
          })}>Popular</button>
        </div>
          <form action="" className="search-form" onSubmit={handleFormSubmit}>
            <div className="input-control">
              <input type="text" placeholder="Search Anime" value={search} onChange={handleChange} />
              <button type="submit">Search</button>
            </div>
            {isSearch && (
              <div className="search-results-count">
                <p>Results: {searchResultsCount}</p>
              </div>
            )}
          </form>
          <div className="filter-btn airing-filter">
            <button onClick={() => handleButtonClick(() => {
              setRendered('airing');
              getAiringAnime();
            })}>Airing</button>
          </div>
          <div className="filter-btn upcoming-filter">
            <button onClick={() => handleButtonClick(() => {
              setRendered('upcoming');
              getUpcomingAnime();
            })}>Upcoming</button>
          </div>
          <div className="filter-btn manga">
            <button onClick={handleMangaClick}>Manga</button>
          </div>
        </div>
      </header>
      {switchComponent()}
    </HomePageStyled>
  )
}

const HomePageStyled = styled.div`
    background-color: #001B3A;
    header{
        padding: 2rem 5rem;
        width: 60%;
        margin: 0 auto;
        transition: all .4s ease-in-out;
        @media screen and (max-width:1530px){
            width: 95%;
        }
        .logo{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
        }
        .search-container{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            button{
              display: flex;
              align-items: center;
              gap: .5rem;
              padding: .7rem 1.5rem;
              outline: none;
              border-radius: 30px;
              font-size: 1.2rem;
              background-color: #fff;
              cursor: pointer;
              transition: all .4s ease-in-out;
              font-family: inherit;
              border: 5px solid #e5e7eb;
            }
            form{
              position: relative;
              width: 100%;
              .input-control{
                position: relative;
                transition: all .4s ease-in-out;
              }
              .input-control input{
                width: 100%;
                padding:.7rem 1rem;
                border: none;
                outline: none;
                border-radius: 30px;
                font-size: 1.2rem;
                background-color: #fff;
                border: 5px solid #e5e7eb;
                transition: all .4s ease-in-out;
              }
              .input-control button{
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
              }
              .search-results-count {
                margin-top: 1rem; 
                text-align: center;
              }
              .search-results-count p {
                margin: 0;
                font-size: 1rem; 
              }    
            }
        }
    }
`;

export default HomePage