import Head from "next/head";
import Featured from "../components/Featured";
import styles from "../styles/Home.module.css";
export default function Home({ pizzaList, admin }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Noordon Bakery</title>
        <meta name="description" content="Best bakery shop in Virginia" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Featured />
    </div>
  );
}


