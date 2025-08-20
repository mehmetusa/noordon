import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Product.module.css";

const Products = ({ products, categories, activeCategory }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.separator}>›</span>
        <span>Products</span>
      </nav>

      <div className={styles.content}>
        {/* Sidebar / Dropdown */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Categories</h3>

          {/* Mobile dropdown button */}
          <div className={styles.mobileDropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {activeCategory} ▼
            </button>
            {showDropdown && (
              <ul className={styles.categoryListDropdown}>
                <li key="all">
                  <Link
                    href="/products?category=All"
                    className={`${styles.catLink} ${
                      activeCategory === "All" ? styles.activeCat : ""
                    }`}
                  >
                    All Products
                  </Link>
                </li>
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
            )}
          </div>

          {/* Desktop list */}
          <ul className={styles.categoryList}>
            <li key="all">
              <Link
                href="/products?category=All"
                className={`${styles.catLink} ${
                  activeCategory === "All" ? styles.activeCat : ""
                }`}
              >
                All Products
              </Link>
            </li>
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
                  <div className={styles.imageWrapper}>
                    <Image
                      src={product.imgs?.[0] || "/img/placeholder.png"}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             33vw"
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.title}>{product.title}</h3>
                    <p className={styles.desc}>{product.desc}</p>
                    <p className={styles.price}>
                      {product.prices?.length > 0
                        ? `Price starts from $${product.prices[0]}`
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
  const category = query.category || "All";

  const [productsRes, categoriesRes] = await Promise.all([
    axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products${
        category && category !== "All" ? `?category=${category}` : ""
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
