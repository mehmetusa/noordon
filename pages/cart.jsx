import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useMemo } from "react";
import { reset, addProduct } from "../redux/cartSlice";
import styles from "../styles/Cart.module.css";

const DELIVERY_SLOTS = [
  "08:00–10:00",
  "10:00–12:00",
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
  "18:00–20:00",
];

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.products.length === 0) return alert("Your cart is empty");
    if (!date || !slot) return alert("Please select delivery date & time");

    const search = new URLSearchParams({ deliveryDate: date, deliverySlot: slot }).toString();
    router.push(`/checkout?${search}`);
    dispatch(reset());
  };

  const handleClearCart = () => {
    if (confirm("Clear all items from cart?")) {
      dispatch(reset());
    }
  };

  const handleEditItem = (item, newQty, newSize) => {
    const basePrice = item.prices[newSize] || 0;
    const extrasTotal = item.price - (item.prices[item.size] || 0);
    const newPrice = basePrice + extrasTotal;

    dispatch(
      addProduct({
        ...item,
        quantity: newQty,
        size: newSize,
        price: newPrice,
      })
    );
  };

  const handleRemoveItem = (itemId) => {
    const newProducts = cart.products.filter((p) => p._id !== itemId);
    dispatch(reset());
    newProducts.forEach((item) => dispatch(addProduct(item)));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Order</h2>

      {cart.products.length > 0 ? (
        <>
          <button className={styles.clearButton} onClick={handleClearCart}>
            🗑 Clear Cart
          </button>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map((item, idx) => {
                  const basePrice = item.prices[item.size] || 0;
                  const extrasTotal = item.price - basePrice;
                  const lineTotal = (basePrice + extrasTotal) * item.quantity;

                  return (
                    <tr key={`${item._id}-${idx}`}>
                      <td className={styles.productInfo}>
                        <Image
                          src={item.imgs?.[0] || item.img}
                          width={50}
                          height={50}
                          alt={item.title}
                          style={{ objectFit: "cover", borderRadius: 6 }}
                        />
                        <span>{item.title}</span>
                      </td>

                      <td>
                        <select
                          value={item.size}
                          onChange={(e) => handleEditItem(item, item.quantity, Number(e.target.value))}
                        >
                          {item.prices.map((_, i) => (
                            <option key={i} value={i}>
                              {["Small", "Medium", "Large"][i] || `Size ${i + 1}`}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleEditItem(item, Number(e.target.value), item.size)}
                          className={styles.qtyInput}
                        />
                      </td>

                      <td>${(basePrice + extrasTotal).toFixed(2)}</td>
                      <td>${lineTotal.toFixed(2)}</td>

                      <td>
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          ✖ Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}

      {/* Delivery Card */}
      <form className={styles.deliveryCard} onSubmit={handleCheckout}>
        <div className={styles.deliveryHeader}>
          <h3>Schedule Delivery</h3>
          <span className={styles.asapBadge}>ASAP not available</span>
        </div>

        <div className={styles.deliveryGrid}>
          <div className={styles.field}>
            <label htmlFor="delivery-date">Delivery date</label>
            <input
              type="date"
              id="delivery-date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="delivery-slot">Time window</label>
            <select
              id="delivery-slot"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a 2-hour slot
              </option>
              {DELIVERY_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.totalCard}>
          <h2>CART TOTAL</h2>
          <p>
            <b>Subtotal:</b> ${cart.total.toFixed(2)}
          </p>
          <p>
            <b>Discount:</b> $0.00
          </p>
          <p>
            <b>Total:</b> ${cart.total.toFixed(2)}
          </p>
          <button type="submit" className={styles.checkoutBtn}>
            ✅ Checkout Now
          </button>
          <p className={styles.inlineNote}>Orders must be scheduled — no ASAP option.</p>
        </div>
      </form>
    </div>
  );
}
