import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import useStyles from "../../utils/paginationStyles";
import { searchMovies } from '../../utils/apiCalls';
import { STATUS } from "../../utils/constans";
import LoaderComponent from "../../components/LoaderComponent/LoaderComponent";
import ErrorView from "../../components/ErrorComponent/ErrorView";
import SearchBar from '../../components/SearchBar/SearchBar';
import moviePlaceholder from "../../images/moviePlaceholder.jpg";
import styles from './MoviesPage.module.css';


const MoviesPage = () => {

  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);

  const page = new URLSearchParams(location.search).get("page") ?? 1;

  useEffect(() => {
    if (location.search === '') {
      return;
    }
    const newSearch = new URLSearchParams(location.search).get('query');
    setQuery(newSearch, page);
  }, [location.search, page]);

  useEffect(() => {
    if (!query) return;
    setStatus(STATUS.PENDING);
    searchMovies(query, page)
    .then(({ results, total_pages }) => {
      if (results.length === 0) {
        setError(`Brak wyników dla ${query}!`);
        setStatus(STATUS.REJECTED);
        return;
      }
      setMovies(results);
      setTotalPages(total_pages);
      setStatus(STATUS.RESOLVED);
    })
    .catch((error) => {
      console.log(error);
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      setStatus(STATUS.REJECTED);
    });
  }, [query, page]);

  const searchTitle = (newSearch) => {
    if (query === newSearch) return;
    setQuery(newSearch);
    setMovies(null);
    setError(null);
    setStatus(STATUS.IDLE);
    navigate({ ...location, search: `query=${newSearch}&page=1` });
  };

  const onHandlePage = (event, page) => {
    navigate({ ...location, search: `query=${query}&page=${page}` });
  }


  return (
    <main className={styles.main}>
      <SearchBar onHandleSubmit={searchTitle} />

      {status === STATUS.PENDING && <LoaderComponent />}
      {status === STATUS.REJECTED && <ErrorView message={error} />}
      {status === STATUS.RESOLVED && (
        <>
          <ul className={styles.moviesList}>
            {movies.map((movie) => (
              <li key={movie.id} className={styles.moviesItem}>
                <Link to={`/movies/${movie.id}`}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` || moviePlaceholder
                        : moviePlaceholder
                    }
                    alt={movie.title || movie.name}
                    className={styles.poster}
                  />
                </Link>
                {movie.title ? (
                  <span className={styles.movieTitle}>{movie.title}</span>
                ) : (
                  <span className={styles.movieTitle}>{movie.name}</span>
                )}
                <p className={styles.vote}>{movie.vote_average}</p>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <Pagination
              className={classes.root}
              count={totalPages}
              onChange={onHandlePage}
              page={Number(page)}
              showFirstButton
              showLastButton
              size="large"
            />
          )}
        </>
      )}


    </main>
  )
}

export default MoviesPage;