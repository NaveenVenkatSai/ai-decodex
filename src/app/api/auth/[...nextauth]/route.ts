import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import pool from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        // Upsert user into MySQL
        await pool.execute(
          `INSERT INTO users (id, name, email, image)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             name = VALUES(name),
             image = VALUES(image),
             last_login = CURRENT_TIMESTAMP`,
          [user.id, user.name, user.email, user.image]
        );
        return true;
      } catch (err) {
        console.error('DB signIn error:', err);
        // Still allow sign-in even if DB fails
        return true;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
  session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
