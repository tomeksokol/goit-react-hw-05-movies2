import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorView from "../../components/ErrorComponent/ErrorView.";
import LoaderComponent from "../../components/LoaderComponent/LoaderComponent";
import MovieDetails from "../../components/MovieDetails/MovieDetails";
import { getMovieDetails } from "../../utils/apiCalls";
import { STATUS } from "../../utils/constans";


const MovieDetailsPage = () => {
  const [movie, setMovie] = useState({});
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);

  useEffect(() => {
    setStatus(STATUS.PENDING);
    getMovieDetails(id, setMovie)
      .then(setMovie)
      .then(setStatus(STATUS.RESOLVED))
      .catch(error => {
        console.log(error);
        setError(error.message);
        setStatus(STATUS.REJECTED);
      });
  }, [id]);

  return (
    <div>
      {status === STATUS.PENDING && <LoaderComponent />}
      {status === STATUS.REJECTED && <ErrorView message={error}/>}
      {status === STATUS.RESOLVED && (
        <MovieDetails movie={movie} status={status}/>
      )}
    </div>
  );
};

export default MovieDetailsPage;