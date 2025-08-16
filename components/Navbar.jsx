import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const quantity = useSelector((state) => state.cart.quantity);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.callButton}>
          <Image src="/img/telephone.png" alt="" width="32" height="32" />
        </div>
        <div className={styles.texts}>
          <div className={styles.text}>ORDER NOW!</div>
          <div className={styles.text}>202-844-9087</div>
        </div>
      </div>

      <div className={styles.item}>
        <ul className={`${styles.list} ${menuOpen ? styles.active : ""}`}>
          <Link href="/products" passHref>
            <li className={styles.listItem}>Products</li>
          </Link>
          <Link href="/catering" passHref>
            <li className={styles.listItem}>Catering</li>
          </Link>

          {status === "authenticated" && session?.user?.role === "admin" && (
            <Link href="/admin" passHref>
              <li className={styles.listItem}>Admin</li>
            </Link>
          )}

          <Link href="/" passHref>
            <li className={styles.listItem}>
              <Image
                className={styles.logo}
                src="/img/noordon.png"
                alt="Noordon Logo"
                width={140}
                height={140}
              />
            </li>
          </Link>

          <Link href="/contact" passHref>
            <li className={styles.listItem}>Contact</li>
          </Link>

          {status !== "authenticated" ? (
            <Link href="/login" passHref>
              <li className={styles.listItem}>Login</li>
            </Link>
          ) : (
            <li
              className={styles.listItem}
              style={{ cursor: "pointer" }}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </li>
          )}
        </ul>

        <div
          className={styles.mobileMenuIcon}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes color="white" size={25} /> : <FaBars color="white" size={25} />}
        </div>
      </div>

      <Link href="/cart" passHref>
        <div className={styles.item}>
          <div className={styles.cart}>
            <Image src="/img/cart.png" alt="" width="30" height="30" />
            <div className={styles.counter}>{quantity}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
