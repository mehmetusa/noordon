import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Product.module.css"; // ✅ Import your CSS module

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const API = process.env.NEXT_PUBLIC_API_URL;
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Our Products</h1>
      <div className={styles.grid}>
        {products?.map((product) => (
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
            <Link href={`/products/${product._id}`} className={styles.link}>
              <button className={styles.button}>View</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
