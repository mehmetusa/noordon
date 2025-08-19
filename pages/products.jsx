// pages/products.js
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Product.module.css";

const Products = ({ products, categories, activeCategory }) => {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.separator}>›</span>
        <span>Products</span>
      </nav>

      <div className={styles.content}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Categories</h3>
          <ul className={styles.categoryList}>
            {categories?.map((cat) => (
              <li key={cat._id}>
                <Link
                  href={`/products?category=${cat.name}`}
                  className={`${styles.catLink} ${
                    activeCategory === cat.name ? styles.activeCat : ""
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <section className={styles.productGrid}>
          {products?.length > 0 ? (
            products.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className={styles.cardLink}
              >
                <div className={styles.card}>
                  {/* Image */}
                  <div className={styles.imageWrapper}>
                    <Image
                      src={product.img}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             33vw"
                      className={styles.image}
                    />
                  </div>

                  {/* Info */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.title}>{product.title}</h3>
                    <p className={styles.desc}>{product.desc}</p>
                    <p className={styles.price}>
                      {product.prices?.length > 0
                        ? `$${product.prices[0]}`
                        : "No price"}
                    </p>
                    <button className={styles.button}>View Details</button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ query }) => {
  const category = query.category || "";

  const [productsRes, categoriesRes] = await Promise.all([
    axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products${
        category ? `?category=${category}` : ""
      }`
    ),
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
  ]);

  return {
    props: {
      products: productsRes.data,
      categories: categoriesRes.data,
      activeCategory: category,
    },
  };
};

export default Products;
