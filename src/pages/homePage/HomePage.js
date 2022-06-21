import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getTrending } from "../../utils/apiCalls";
import { STATUS } from "../../utils/constans";
import LoaderComponent from "../../components/LoaderComponent/LoaderComponent";
import ErrorView from "../../components/ErrorComponent/ErrorView.";
// import slugify from "slugify";
import { Pagination } from "@material-ui/lab";
import useStyles from "../../utils/paginationStyles";
import styles from "./HomePage.module.css";
import moviePlaceholder from "../../images/moviePlaceholder.jpg";

// const makeSlug = (string) => slugify(string, { lower: true });

const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [movies, setMovies] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);

  const page = new URLSearchParams(location.search).get("page") ?? 1;

  useEffect(() => {
    setStatus(STATUS.PENDING);
    getTrending(page)
      .then(({ results, total_pages }) => {
        setMovies(results);
        setTotalPages(total_pages);
        setStatus(STATUS.RESOLVED);
      })
      .catch((error) => {
        console.log(error);
        setError("Coś poszło nie tak. Spróbuj ponownie.");
        setStatus(STATUS.REJECTED);
      });
  }, [page]);

  const onHandlePage = (event, page) => {
    navigate({ ...location, search: `page=${page}` });
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Dziś na topie</h1>

      {status === STATUS.PENDING && <LoaderComponent />}
      {status === STATUS.REJECTED && <ErrorView message={error.message} />}
      {status === STATUS.RESOLVED && (
        <>
          <ul className={styles.moviesList}>
            {movies.map((movie) => (
              <li key={movie.id} className={styles.moviesItem}>
                <Link to={`/movies/${movie.id}`}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
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
  );
};

export default HomePage;
