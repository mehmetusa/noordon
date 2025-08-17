import { useState } from "react";
import Image from "next/image";
import styles from "../styles/Featured.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Featured = () => {
  const [index, setIndex] = useState(0);

  const images = [
    "/img/featured11.avif",
    "/img/featured22.jpg",
    "/img/featured33.jpg",
  ];

  const handleArrow = (direction) => {
    if (direction === "l") {
      setIndex(index !== 0 ? index - 1 : images.length - 1);
    }
    if (direction === "r") {
      setIndex(index !== images.length - 1 ? index + 1 : 0);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.arrow} style={{ left: "10px" }} onClick={() => handleArrow("l")}>
        <FaArrowLeft size={30} color="#fff" />
      </div>

      <div className={styles.wrapper} style={{ transform: `translateX(${-100 * index}vw)` }}>
        {images.map((img, i) => (
          <div className={styles.imgContainer} key={i}>
            <Image
              src={img}
              alt={`Slide ${i + 1}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        ))}
      </div>

      <div className={styles.arrow} style={{ right: "10px" }} onClick={() => handleArrow("r")}>
        <FaArrowRight size={30} color="#fff" />
      </div>
    </div>
  );
};

export default Featured;
