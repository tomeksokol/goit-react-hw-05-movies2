import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import styles from "./LoaderComponent.module.css";

function LoaderComponent() {
  return (
    <div className={styles.overlay}>
      <Loader
        type="Puff"
        color="#fa7584"
        height={100}
        width={100}
        timeout={0}
      />
    </div>
  );
}

export default LoaderComponent;
