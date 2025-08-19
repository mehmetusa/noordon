import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Cart.module.css";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.products.length === 0) return alert("Your cart is empty");
    router.push("/checkout");
  };

  return (
    <div className={styles.container}>
      {/* Cart Items Table */}
      <div className={styles.left}>
        <h2 className={styles.title}>Your Order</h2>
        {cart.products.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.products.map((item) => (
                <tr key={item._id}>
                  <td className={styles.productInfo}>
                    <Image
                      src={item.imgs?.[0] || item.img}
                      width={50}
                      height={50}
                      alt={item.title}
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                    />
                    <span>{item.title}</span>
                  </td>
                  <td>{item.quantity}</td>
                  <td>${item.prices[item.size]}</td>
                  <td>${item.prices[item.size] * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {/* Cart Total */}
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b> ${cart.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b> $0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b> ${cart.total}
          </div>
          <button onClick={handleCheckout} className={styles.button}>
            CHECKOUT NOW!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
