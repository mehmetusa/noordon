// pages/products.js
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Product.module.css";

const Products = ({ pizzaList }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Our Products</h1>
      <div className={styles.grid}>
        {pizzaList?.map((product) => (
          <div key={product._id} className={styles.card}>
            <Image
              src={product.img}
              alt={product.title}
              width={250}
              height={180}
              className={styles.image}
            />
            <h3 className={styles.title}>{product.title}</h3>
            <p className={styles.desc}>{product.desc}</p>
            <p className={styles.price}>
              {product.prices?.length > 0 ? `$${product.prices[0]}` : "No price"}
            </p>
            <Link href={`/product/${product._id}`} className={styles.link}>
              <button className={styles.button}>View</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);

  return {
    props: {
      pizzaList: res.data,
    },
  };
};

export default Products;
