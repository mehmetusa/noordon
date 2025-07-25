import styles from "../styles/PizzaList.module.css";
import PizzaCard from "./PizzaCard";

const PizzaList = ({ pizzaList }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>THE BEST TURKISH FOODS IN NORTHERN VIRGINIA</h1>
      <p className={styles.desc}>
      Experience authentic Turkish flavors in Northern Virginia — from juicy kebabs and warm pide to rich baklava and fresh mezes. Local spots bring the taste of Turkey with every bite. Perfect for food lovers seeking tradition and flavor.
      </p>
      <div className={styles.wrapper}>
        {pizzaList.map((pizza) => (
          <PizzaCard key={pizza._id} pizza={pizza} />
        ))}
      </div>
    </div>
  );
};

export default PizzaList;
