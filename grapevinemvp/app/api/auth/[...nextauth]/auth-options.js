import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from '@/mongodb';
import User from '@/models/User';
import { compare } from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
          
          if (!credentials?.email || !credentials?.password) {
            console.error('Missing credentials');
            return null;
          }
          
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.error('User not found:', credentials.email);
            return null;
          }
          
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            console.error('Invalid password');
            return null;
          }
          
          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email 
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  debug: true,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};