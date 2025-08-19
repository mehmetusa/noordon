import React from "react";
import styles from "../styles/Admin.module.css";

const AddButton = ({ setClose }) => {
  return (
    <button
      className={styles.addProductButtonBottom}
      onClick={() => setClose(false)}
    >
      Add New Product
    </button>
  );
};

export default AddButton;
