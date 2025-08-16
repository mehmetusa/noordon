// pages/admin/index.jsx
import { useState } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import styles from "../styles/Admin.module.css";
import { useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;


const AdminPage = ({ orders, products }) => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [pizzaList, setPizzaList] = useState(products);
  const [orderList, setOrderList] = useState(orders);
  const statusList = ["preparing", "on the way", "delivered"];

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") router.push("/login");
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "admin") return null;


  // // Redirect if not admin
  // if (sessionStatus === "loading") return <p>Loading...</p>;
  // if (!session || session?.user?.role !== "admin") {
  //   router.push("/login");
  //   return null;
  // }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/products/${id}`);
      setPizzaList((prev) => prev.filter((pizza) => pizza._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async (id) => {
    const item = orderList.find((order) => order._id === id);
    try {
      const res = await axios.put(`${API}/api/orders/${id}`, {
        status: item.status + 1,
      });
      setOrderList([res.data, ...orderList.filter((order) => order._id !== id)]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ padding: "2rem" }}>
        <h1>Welcome Admin</h1>
        <p>You are logged in as: {session.user.name}</p>
        <button onClick={() => signOut()} style={{ marginTop: "1rem" }}>
          Logout
        </button>
      </div>

      {/* Products table */}
      <div className={styles.item}>
        <h1 className={styles.title}>Products</h1>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Image</th>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </tbody>
          {pizzaList.map((product) => (
            <tbody key={product._id}>
              <tr className={styles.trTitle}>
                <td>
                  <Image
                    src={product.img}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                    alt={product.title}
                  />
                </td>
                <td>{product._id.slice(0, 5)}...</td>
                <td>{product.title}</td>
                <td>${product.prices[0]}</td>
                <td>
                  <button className={styles.button}>Edit</button>
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {/* Orders table */}
      <div className={styles.item}>
        <h1 className={styles.title}>Orders</h1>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Id</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </tbody>
          {orderList.map((order) => (
            <tbody key={order._id}>
              <tr className={styles.trTitle}>
                <td>{order._id.slice(0, 5)}...</td>
                <td>{order.customer}</td>
                <td>${order.total}</td>
                <td>{order.method === 0 ? "cash" : "paid"}</td>
                <td>{statusList[order.status]}</td>
                <td>
                  <button onClick={() => handleStatus(order._id)}>Next Stage</button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session || session.user.name !== "admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const productRes = await axios.get(`${API}/api/products`);
  const orderRes = await axios.get(`${API}/api/orders`);

  return {
    props: {
      orders: orderRes.data,
      products: productRes.data,
    },
  };
};

export default AdminPage;
