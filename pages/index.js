import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Add from "../components/Add";
// import AddButton from "../components/AddButton";
import Featured from "../components/Featured";
// import PizzaList from "../components/PizzaList";
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


