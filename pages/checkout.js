import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { reset } from "../redux/cartSlice";
import axios from "axios";

const Checkout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace("/login"); // redirect if not logged in
    }
  }, [status, session, router]);

  if (status === "loading" || !session) return <p>Loading...</p>;

  const createOrder = async (orderData) => {
    try {
      const res = await axios.post(`${API}/api/orders`, orderData);
      if (res.status === 201) {
        dispatch(reset());
        router.push(`/orders/${res.data._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ButtonWrapper = ({ currency }) => {
    const [{ options }] = usePayPalScriptReducer();
    return (
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              { amount: { currency_code: currency, value: cart.total } },
            ],
          });
        }}
        onApprove={function (data, actions) {
          return actions.order.capture().then(function (details) {
            const shipping = details.purchase_units[0].shipping;
            createOrder({
              customer: shipping.name.full_name,
              address: shipping.address.address_line_1,
              total: cart.total,
              method: 1, // PayPal
            });
          });
        }}
      />
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Checkout</h1>
      <p>Hello, {session.user.name}</p>
      <h2>Cart Total: ${cart.total}</h2>

      <div>
        <button
          onClick={() =>
            createOrder({
              customer: session.user.name,
              address: "User address here",
              total: cart.total,
              method: 0, // Cash on delivery
            })
          }
        >
          Cash on Delivery
        </button>

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
  );
};

export default Checkout;
