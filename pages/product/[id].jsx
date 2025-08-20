import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";
import styles from "../../styles/ProductDetail.module.css";
import axios from "axios";
import Toast from "../../components/Toast";

const Product = ({ pizza }) => {
  if (!pizza) return <div>Product not found.</div>;

  const [mainImg, setMainImg] = useState(pizza.imgs?.[0] || pizza.img);
  const [price, setPrice] = useState(pizza.prices?.[0] || 0);
  const [size, setSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);
  const [toastShow, setToastShow] = useState(false);

  const dispatch = useDispatch();

  const changePrice = (number) => setPrice((prev) => prev + number);

  const handleSize = (sizeIndex) => {
    const difference = pizza.prices[sizeIndex] - pizza.prices[size];
    setSize(sizeIndex);
    changePrice(difference);
  };

  const handleChange = (e, option) => {
    if (e.target.checked) {
      changePrice(option.price);
      setExtras((prev) => [...prev, option]);
    } else {
      changePrice(-option.price);
      setExtras(extras.filter((extra) => extra._id !== option._id));
    }
  };

  const handleClick = () => {
    dispatch(addProduct({ ...pizza, extras, price, quantity }));
    setToastShow(true);
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbWrapper}>
  <nav className={styles.breadcrumb} aria-label="Breadcrumb">
    <Link href="/" className={styles.breadcrumbLink}>Home</Link>
    <span className={styles.separator}>›</span>
    <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
    <span className={styles.separator}>›</span>
    <span className={styles.current}>{pizza.title}</span>
  </nav>
</div>



      <div className={styles.left}>
        <div className={styles.mainImage}>
          <Image
            src={mainImg}
            layout="fill"
            objectFit="contain"
            alt={pizza.title}
          />
        </div>
        <div className={styles.thumbnails}>
          {(pizza.imgs || [pizza.img]).map((img, index) => (
            <div
              key={index}
              className={styles.thumbnail}
              onClick={() => setMainImg(img)}
            >
              <Image
                src={img}
                layout="fill"
                objectFit="cover"
                alt={`thumbnail-${index}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>${price}</span>
        <p className={styles.desc}>{pizza.desc}</p>

        <h3 className={styles.choose}>Choose the size</h3>
        <div className={styles.sizes}>
          {["Small", "Medium", "Large"].map((label, i) => (
            <div key={i} className={styles.size} onClick={() => handleSize(i)}>
              <span className={styles.number}>{label}</span>
            </div>
          ))}
        </div>

        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          {pizza.extraOptions?.map((option) => (
            <div className={styles.option} key={option._id}>
              <input
                type="checkbox"
                id={option.text}
                name={option.text}
                onChange={(e) => handleChange(e, option)}
              />
              <label htmlFor={option.text}>{option.text}</label>
            </div>
          ))}
        </div>

        <div className={styles.add}>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.quantity}
          />
          <button className={styles.button} onClick={handleClick}>
            Add to Cart
          </button>
          <Toast
            message="Product added to cart!"
            show={toastShow}
            setShow={setToastShow}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;

export const getServerSideProps = async ({ params }) => {
  const API = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await axios.get(`${API}/api/products/${params.id}`);
    const pizza = res.data || null;

    return {
      props: { pizza },
    };
  } catch (err) {
    console.error(err);
    return { props: { pizza: null } };
  }
};
