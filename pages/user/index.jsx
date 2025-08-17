import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function User() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const API = process.env.NEXT_PUBLIC_API_URL;

  // Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "user") router.replace("/login");
    if (session) {
      setUserInfo({
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone || "",
        address: session.user.address || "",
      });
    }
  }, [status, session, router]);

  // Fetch user orders
  useEffect(() => {
    if (!session) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/orders?user=${session.user.email}`);
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, [session]);

  // Update user info
  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/api/users/${session.user.id}`, userInfo);
      alert("Profile updated!");
    } catch (err) {
      console.log(err);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "user") return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>User Panel</h1>
        <p>Welcome, <b>{session.user.name}</b></p>
        <button style={styles.logoutButton} onClick={() => signOut()}>Logout</button>
      </div>

      <div style={styles.section}>
        <h2>Update Info</h2>
        <div style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Phone"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Address"
            value={userInfo.address}
            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
          />
          <button style={styles.updateButton} onClick={handleUpdate}>Update Info</button>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div style={styles.ordersContainer}>
            {orders.map((order) => (
              <div key={order._id} style={styles.orderCard}>
                <p><b>Order ID:</b> {order._id}</p>
                <p><b>Total:</b> ${order.total}</p>
                <p><b>Payment:</b> {order.method === 0 ? "Cash" : "Paid"}</p>
                <p><b>Status:</b> {["preparing", "on the way", "delivered"][order.status]}</p>
                <p><b>Address:</b> {order.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "2rem auto",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  logoutButton: {
    backgroundColor: "#d1411e",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  section: {
    marginBottom: "3rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "400px",
  },
  input: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  updateButton: {
    backgroundColor: "#4285f4",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
  ordersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  orderCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
  },
};
