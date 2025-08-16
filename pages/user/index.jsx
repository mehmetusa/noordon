import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session?.user?.role !== "user") router.push("/login");
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session?.user?.role !== "user") return <p>Unauthorized</p>;

  return (
    <div>
      <h1>User Panel</h1>
      <p>Welcome, {session.user.name}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
