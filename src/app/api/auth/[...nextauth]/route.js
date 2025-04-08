// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import User from "@/models/User";
// import { connectToDatabase } from "@/lib/mongodb";

// export const authOptions = {
//   session: { strategy: "jwt" },

//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectToDatabase();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) throw new Error("User not found");

//         const isPasswordValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );
//         if (!isPasswordValid) throw new Error("Invalid password");

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.email = token.email;
//       return session;
//     },
//   },

//   // ✅ Define custom pages explicitly
//   pages: {
//     signIn: "/login", // Redirect here on error or when login is needed
//     error: "/login",  // Redirect here on login failure
//   },

//   secret: process.env.NEXTAUTH_SECRET,
//   debug: true,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user", // ✅ Default to 'user' if role is missing
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Optional: show errors on login page
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };