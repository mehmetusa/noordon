// pages/product/[id].js
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";
import styles from "../../styles/ProductDetail.module.css";
import Toast from "../../components/Toast";
import axios from "axios";

const Product = ({ pizza }) => {
  if (!pizza) return <div>Product not found.</div>;

  const [mainImg, setMainImg] = useState(pizza.imgs?.[0] || pizza.img);
  const [size, setSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);
  const [price, setPrice] = useState(pizza.prices?.[0] || 0);
  const [toastShow, setToastShow] = useState(false);

  const dispatch = useDispatch();

  const updatePrice = (amount) => setPrice((prev) => prev + amount);

  const handleSizeChange = (index) => {
    const diff = pizza.prices[index] - pizza.prices[size];
    setSize(index);
    updatePrice(diff);
  };

  const handleExtraChange = (e, option) => {
    if (e.target.checked) {
      updatePrice(option.price);
      setExtras((prev) => [...prev, option]);
    } else {
      updatePrice(-option.price);
      setExtras(extras.filter((extra) => extra._id !== option._id));
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addProduct({
        ...pizza,
        size,
        quantity,
        extras,
        prices: pizza.prices,
        price,
      })
    );
    setToastShow(true);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span className={styles.separator}>›</span>
        <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
        <span className={styles.separator}>›</span>
        <span className={styles.current}>{pizza.title}</span>
      </nav>

      <div className={styles.left}>
        <div className={styles.mainImage}>
          <Image src={mainImg} layout="fill" objectFit="contain" alt={pizza.title} />
        </div>
        <div className={styles.thumbnails}>
          {(pizza.imgs || [pizza.img]).map((img, idx) => (
            <div key={idx} className={styles.thumbnail} onClick={() => setMainImg(img)}>
              <Image src={img} layout="fill" objectFit="cover" alt={`Thumbnail ${idx}`} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>${price.toFixed(2)}</span>
        <p className={styles.desc}>{pizza.desc}</p>

        <h3 className={styles.choose}>Choose size</h3>
        <div className={styles.sizes}>
          {["Small", "Medium", "Large"].map((label, i) => (
            <div key={i} className={styles.size} onClick={() => handleSizeChange(i)}>
              <span className={styles.number}>{label}</span>
            </div>
          ))}
        </div>

        {pizza.extraOptions?.length > 0 && (
          <>
            <h3 className={styles.choose}>Additional ingredients</h3>
            <div className={styles.ingredients}>
              {pizza.extraOptions.map((option) => (
                <div className={styles.option} key={option._id}>
                  <input
                    type="checkbox"
                    id={option.text}
                    name={option.text}
                    onChange={(e) => handleExtraChange(e, option)}
                  />
                  <label htmlFor={option.text}>
                    {option.text} (+${option.price.toFixed(2)})
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        <div className={styles.add}>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.quantity}
          />
          <button className={styles.button} onClick={handleAddToCart}>Add to Cart</button>
          <Toast message="Product added to cart!" show={toastShow} setShow={setToastShow} />
        </div>
      </div>
    </div>
  );
};

// Fetch product server-side
export const getServerSideProps = async (context) => {
  const { id } = context.query;

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
    const pizza = res.data;

    return { props: { pizza } };
  } catch (err) {
    return { props: { pizza: null } };
  }
};

export default Product;
