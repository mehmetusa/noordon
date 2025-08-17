import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../styles/Cart.module.css"; // <-- add this


const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.products.length === 0) return alert("Your cart is empty");
    router.push("/checkout"); // redirect to checkout page
  };

  return (
    <div className={styles.container}>
      {/* Render cart items table here (your existing table) */}
      
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>${cart.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>${cart.total}
          </div>
          <button
            onClick={handleCheckout}
            className={styles.button}
          >
            CHECKOUT NOW!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
