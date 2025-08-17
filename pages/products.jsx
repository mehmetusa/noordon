// pages/products.js
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Product.module.css";

const Products = ({ pizzaList, categories }) => {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link> <span>›</span> <span>Products</span>
      </nav>

      <div className={styles.content}>
        {/* Categories Sidebar */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Categories</h3>
          <ul className={styles.categoryList}>
            {categories?.map((cat) => (
              <li key={cat._id} className={styles.categoryItem}>
                <Link href={`/products?category=${cat.name}`} className={styles.catLink}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <div className={styles.productGrid}>
          {pizzaList?.length > 0 ? (
            pizzaList.map((product) => (
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
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const { query } = ctx;
  const category = query.category || "";

  const [productsRes, categoriesRes] = await Promise.all([
    axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products${
        category ? `?category=${category}` : ""
      }`
    ),
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
  ]);

  return {
    props: {
      pizzaList: productsRes.data,
      categories: categoriesRes.data,
    },
  };
};

export default Products;
