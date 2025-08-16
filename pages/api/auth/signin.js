import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // redirect after login
  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "admin") router.push("/admin");
      else router.push("/user");
    }
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
    <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}>
      <div style={{ padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <button onClick={handleGoogleLogin} style={{ marginTop: "1rem" }}>Sign in with Google</button>
        <p style={{ marginTop: "1rem" }}>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
