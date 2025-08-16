import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Admin account
        if (
          credentials.username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
          credentials.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        ) {
          return { name: "Admin", role: "admin" };
        }

        // Example normal user
        if (credentials.username === "user" && credentials.password === "user") {
          return { name: "User", role: "user" };
        }

        return null; // invalid credentials
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
