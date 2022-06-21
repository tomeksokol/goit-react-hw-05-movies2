import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieReviews } from '../../utils/apiCalls';
import { STATUS } from "../../utils/constans";
import LoaderComponent from "../../components/LoaderComponent/LoaderComponent";
import ErrorView from "../../components/ErrorComponent/ErrorView";
import styles from './Reviews.module.css';
import ShowMore from 'react-simple-show-more';


const Reviews = () => {

  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);

  useEffect(() => {
    setStatus(STATUS.PENDING);
    getMovieReviews(id)
    .then(({ results }) => {
     setReviews(results);
     setStatus(STATUS.RESOLVED);
    })
    .catch(error => {
      console.log(error);
      setError("Coś poszło nie tak, spróbuj ponownie.");
      setStatus(STATUS.REJECTED);
    });
  }, [id])

  return (
    <>
      {status === STATUS.PENDING && <LoaderComponent />}
      {status === STATUS.REJECTED && <ErrorView message={error}/>}
      {status === STATUS.RESOLVED && (
        <ul>
          {reviews.length < 1 ? (
            <p>Przepraszamy, brak recenzji dla tego filmu</p>
          ) : (
            reviews.map(review => (
              <li key={review.id} className={styles.item}>
                <h3 className={styles.author}>Autor: {review.author}</h3>
                <p className={styles.content}>
                  <ShowMore
                    text={review.content}
                    length={700}
                    showMoreLabel=" Rozwiń >>"
                    showLessLabel=" Schowaj <<"
                    style={{
                      cursor: 'pointer',
                      color: '#fa7584',
                      fontWeight: 'bold',
                    }}
                  />
                </p>
              </li>
            ))
          )
        }
        </ul>
      )}
      
    </>
  )
}

export default Reviews