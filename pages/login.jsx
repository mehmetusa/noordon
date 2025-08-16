import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session.user.role === "admin") router.replace("/admin");
    else if (session.user.role === "user") router.replace("/user");
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res.error) alert("Invalid credentials");
  };

  const handleGoogleLogin = () => signIn("google", { callbackUrl: "/user" });

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">
            Login
          </button>
        </form>

        <p style={styles.orText}>OR</p>
        <button style={styles.googleButton} onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        <p style={{ marginTop: "1rem", color: "#555" }}>
          Don’t have an account?{" "}
          <Link href="/signup" style={{ color: "#d1411e", textDecoration: "underline" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    padding: "3rem",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: { fontSize: "2rem", marginBottom: "2rem", color: "#333" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.75rem 1rem", fontSize: "1rem", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "0.75rem", fontSize: "1rem", backgroundColor: "#d1411e", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  orText: { margin: "1.5rem 0 1rem", color: "#555" },
  googleButton: { padding: "0.75rem", fontSize: "1rem", backgroundColor: "#4285F4", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
};
