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
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD
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
      if (user?.id) token.id = user.id; // add user ID to token
      return token;
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role;
      if (token?.id) session.user.id = token.id; // add user ID to session
      return session;
    },
  
  
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});


// callbacks: {
//   async session({ session, token, user }) {
//     session.user.id = user.id; // add the MongoDB user ID
//     session.user.role = user.role; // if you have roles
//     return session;
//   },
// }