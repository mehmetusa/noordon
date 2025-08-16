import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";

export default function Admin({ products, orders }) {
  const [pizzaList, setPizzaList] = useState(products);
  const [orderList, setOrderList] = useState(orders);

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Products: {pizzaList.length}</p>
      <p>Orders: {orderList.length}</p>
      {/* Add your table and buttons here */}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session || session?.user?.role !== "admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);

  return {
    props: {
      products: await productRes.json(),
      orders: await orderRes.json(),
    },
  };
}
