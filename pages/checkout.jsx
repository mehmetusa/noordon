// pages/checkout.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { reset } from "../redux/cartSlice";
import { persistor } from "../redux/store";
import Image from "next/image";
import axios from "axios";
import styles from "../styles/Checkout.module.css";

const Checkout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const { deliveryDate, deliverySlot } = router.query;

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) return <p>Loading...</p>;

  const createOrder = async (orderData) => {
    try {
      if (!orderData.deliveryDate || !orderData.deliverySlot) {
        return alert("Delivery date and slot are required");
      }
      const res = await axios.post(`${API}/api/orders`, orderData);
      if (res.status === 201) {
        dispatch(reset());
        await persistor.flush();
        router.push(`/orders/${res.data._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCOD = async () => {
    if (!deliveryDate || !deliverySlot) {
      return alert("Please select delivery date and slot before placing order.");
    }
    await createOrder({
      customer: session.user.name,
      address: "User address here",
      total: cart.total,
      method: 0,
      deliveryDate,
      deliverySlot,
    });
  };

  const ButtonWrapper = ({ currency }) => {
    const [{ options }] = usePayPalScriptReducer();
    return (
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) =>
          actions.order.create({
            purchase_units: [{ amount: { currency_code: currency, value: cart.total } }],
          })
        }
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          const shipping = details.purchase_units[0].shipping;
          await createOrder({
            customer: shipping.name.full_name,
            address: shipping.address.address_line_1,
            total: cart.total,
            method: 1,
            deliveryDate,
            deliverySlot,
          });
        }}
      />
    );
  };

  console.log("mehmet cart",cart)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      <p className={styles.userGreeting}>Hello, {session.user.name}</p>

      <div className={styles.cartItems}>
        <h2>Your Order</h2>
        {cart.products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.products.map((item) => (
                <tr key={item._id}>
                  <td className={styles.productName}>
                    <Image
                      src={item.imgs?.[0] || item.img}
                      width={50}
                      height={50}
                      alt={item.title}
                      style={{ objectFit: "cover", borderRadius: 6 }}
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

      <div className={styles.orderSummary}>
        <h2>Order Summary</h2>
        <div className={styles.orderSummaryRow}>
          <span>Subtotal:</span>
          <span>${cart.total}</span>
        </div>
        <div className={styles.orderSummaryRow}>
          <span>Discount:</span>
          <span>$0.00</span>
        </div>
        <div className={`${styles.orderSummaryRow} ${styles.total}`}>
          <span>Total:</span>
          <span>${cart.total}</span>
        </div>

        <div className={styles.paymentButtons}>
          <button className={styles.codButton} onClick={handleCOD}>
            Cash on Delivery
          </button>

          <div>
            <PayPalScriptProvider
              options={{
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                components: "buttons",
                currency: "USD",
              }}
            >
              <ButtonWrapper currency="USD" />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
