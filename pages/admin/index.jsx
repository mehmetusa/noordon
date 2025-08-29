import { useState, useEffect } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import styles from "../../styles/Admin.module.css";
import AddButton from "../../components/AddButton";
import Add from "../../components/Add";
import EditProductModal from "../../components/EditProductModal";

const API = process.env.NEXT_PUBLIC_API_URL;

const AdminPage = ({ orders = [], products = [], users = [] }) => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [pizzaList, setPizzaList] = useState(products);
  const [orderList, setOrderList] = useState(orders);
  const [userList, setUserList] = useState(users);
  const [close, setClose] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeSection, setActiveSection] = useState("products"); // "products", "orders", "users"
  const statusList = ["preparing", "on the way", "delivered"];

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/login");
    }
  }, [sessionStatus, session, router]);

  if (sessionStatus === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "admin") return null;

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      if (res.status === 200) setPizzaList(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  // UPDATE PRODUCT
  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API}/api/products/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      if (res.status === 200) {
        setPizzaList(prev => prev.map(p => (p._id === id ? res.data : p)));
        setEditingProduct(null);
        alert("Product updated!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  // UPDATE ORDER STATUS
  const handleStatus = async (id) => {
    const item = orderList.find(order => order._id === id);
    try {
      const res = await axios.put(`${API}/api/orders/${id}`, { status: item.status + 1 });
      setOrderList([res.data, ...orderList.filter(o => o._id !== id)]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Side Panel */}
      <div className={styles.sidePanel}>
        <h2>Admin Panel</h2>
        <button onClick={() => setActiveSection("products")} className={activeSection === "products" ? styles.activeTab : ""}>Products</button>
        <button onClick={() => setActiveSection("orders")} className={activeSection === "orders" ? styles.activeTab : ""}>Orders</button>
        <button onClick={() => setActiveSection("users")} className={activeSection === "users" ? styles.activeTab : ""}>Users</button>
        <button onClick={() => signOut()} className={styles.logoutButtonSide}>Logout</button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* PRODUCTS */}
        {activeSection === "products" && (
          <>
            <div className={styles.addButtonWrapper}>
              <AddButton setClose={setClose} />
              {!close && <Add setClose={setClose} />}
            </div>
            <div className={styles.item}>
              <h2 className={styles.title}>Products</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pizzaList.length > 0 ? pizzaList.map(product => (
                    <tr key={product._id} className={styles.trTitle}>
                      <td>
                        {product.imgs?.length > 0 ? (
                          <Image
                            src={product.imgs[0]}
                            width={50}
                            height={50}
                            style={{ objectFit: "cover", borderRadius: "6px" }}
                            alt={product.title}
                          />
                        ) : <div style={{ width: 50, height: 50, backgroundColor: "#eee", borderRadius: "6px" }} />}
                      </td>
                      <td>{product.shortId}</td>
                      <td>{product.title}</td>
                      <td>${product.prices[0]}</td>
                      <td>
                        <button onClick={() => setEditingProduct(product)} className={styles.button}>Edit</button>
                        <button onClick={() => handleDelete(product._id)} className={styles.button}>Delete</button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={5}>No products found</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ORDERS */}
        {activeSection === "orders" && (
          <div className={styles.item}>
            <h2 className={styles.title}>Orders</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orderList.length > 0 ? orderList.map(order => (
                  <tr key={order._id} className={styles.trTitle}>
                    <td>{order.shortId}</td>
                    <td>{order.customer}</td>
                    <td>${order.total}</td>
                    <td>{order.method === 0 ? "Cash" : "Paid"}</td>
                    <td>{["preparing", "on the way", "delivered"][order.status]}</td>
                    <td>
                      <button onClick={() => handleStatus(order._id)} className={styles.button}>Next Stage</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={6}>No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {activeSection === "users" && (
          <div className={styles.item}>
            <h2 className={styles.title}>Users</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {userList.length > 0 ? userList.map(user => (
                  <tr key={user._id} className={styles.trTitle}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                )) : <tr><td colSpan={3}>No users found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {editingProduct && (
          <EditProductModal
            isOpen={!!editingProduct}
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={(id, data) => handleUpdate(id, data)}
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });
  if (!session || session.user.role !== "admin") {
    return { redirect: { destination: "/login", permanent: false } };
  }

  let products = [], orders = [], users = [];

  try { products = (await axios.get(`${API}/api/products`)).data || []; } catch(e) { console.error(e); }
  try { orders = (await axios.get(`${API}/api/orders`)).data || []; } catch(e) { console.error(e); }
  try { users = (await axios.get(`${API}/api/users`)).data || []; } catch(e) { console.error(e); }

  return { props: { products, orders, users } };
};

export default AdminPage;
