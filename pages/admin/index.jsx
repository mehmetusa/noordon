import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") router.replace("/login");
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "admin") return null;

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {session.user.name}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
