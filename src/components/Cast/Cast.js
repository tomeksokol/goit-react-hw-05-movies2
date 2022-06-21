import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieCast } from "../../utils/apiCalls";
import actorPlaceholder from "../../images/actorPlaceholder.jpg";
import styles from "./Cast.module.css";
import { STATUS } from "../../utils/constans";
import LoaderComponent from "../../components/LoaderComponent/LoaderComponent";
import ErrorView from "../../components/ErrorComponent/ErrorView";

const Cast = () => {
  // const [cast, setCast] = useState([]);
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [authors, setAuthors] = useState(null);

  useEffect(() => {
    setStatus(STATUS.PENDING);
    getMovieCast(id)
      .then(({ cast }) => {
        setAuthors(cast);
        setStatus(STATUS.RESOLVED);
      })
      .catch((error) => {
        console.log(error);
        setError("Coś poszło nie tak, spróbuj ponownie.");
        setStatus(STATUS.REJECTED);
      });
  }, [id]);

  return (
    <>
      {status === STATUS.PENDING && <LoaderComponent />}
      {status === STATUS.REJECTED && <ErrorView message={error} />}
      {status === STATUS.RESOLVED && (
        <ul className={styles.cast}>
          {authors.length < 1 ? (
            <p>Przepraszamy, brak opisu</p>
          ) : (
            authors.map(({ character, id, name, profile_path }) => (
              <li key={id} className={styles.item}>
                {profile_path === null ? (
                  <img
                    src={actorPlaceholder}
                    alt="Zdjęcie jest niedostępne"
                    className={styles.photo}
                  />
                ) : (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${profile_path}`}
                    alt={`${name}`}
                    className={styles.photo}
                  />
                )}
                <h4 className={styles.name}>Aktor: {name}</h4>
                <p className={styles.character}>Rola: {character}</p>
              </li>
            ))
          )}
        </ul>
      )}
    </>
  );
};

export default Cast;
