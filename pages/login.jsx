import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";




export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    console.log("pass",password)
    console.log("user",username)

    if (res.ok) router.push("/admin");
    else alert("Invalid credentials");
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
      <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>

      <p style={{ margin: "1rem 0" }}>or</p>

      <button onClick={handleGoogleLogin} style={styles.googleButton}>
        Sign in with Google
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "5rem auto",
    padding: "2rem",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#d1411e",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  googleButton: {
    padding: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
