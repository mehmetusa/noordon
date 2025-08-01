import { getSession, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Admin.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;



const Admin = ({ orders, products }) => {
  const [pizzaList, setPizzaList] = useState(products);
  const [orderList, setOrderList] = useState(orders);
  const status = ["preparing", "on the way", "delivered"];
  const { data: session } = useSession();
  const router = useRouter();
  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.name !== "admin") return <p>Unauthorized</p>;

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session?.user?.name !== "admin") {
      router.push("/");
    }
  }, [session, router]);

  if (!session || session?.user?.name !== "admin") {
    return <p>Loading or unauthorized...</p>;
  }

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const res = await axios.delete(`${API}/api/products/` + id);

      setPizzaList(pizzaList.filter((pizza) => pizza._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async (id) => {
    const item = orderList.filter((order) => order._id === id)[0];
    const currentStatus = item.status;

    try {
      const res = await axios.put(`${API}/api/products/`+ id, {
        status: currentStatus + 1,
      });
      setOrderList([
        res.data,
        ...orderList.filter((order) => order._id !== id),
      ]);
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
                    objectFit="cover"
                    alt=""
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
                <td>
                  {order.method === 0 ? <span>cash</span> : <span>paid</span>}
                </td>
                <td>{status[order.status]}</td>
                <td>
                  <button onClick={() => handleStatus(order._id)}>
                    Next Stage
                  </button>
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
  const myCookie = ctx.req?.cookies || "";
console.log("my koki",myCookie);
  if (myCookie.token !== process.env.TOKEN) {
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

export default Admin;
