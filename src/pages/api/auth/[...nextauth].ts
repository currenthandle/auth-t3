import NextAuth, { type NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

// Prisma adapter for NextAuth, optional and can be removed
//import { PrismaAdapter } from '@next-auth/prisma-adapter'

import { env } from '../../../env/server.mjs'
import { prisma } from '../../../server/db/client'

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  // callbacks: {
  //   session({ session, user }) {
  //     if (session.user) {
  //       session.user.id = user.id
  //     }
  //     return session
  //   },
  // },
  // Configure one or more authentication providers
  //adapter: PrismaAdapter(prisma),

  // pages: {
  //   // signIn: '/auth/login',
  //   //signIn: '/login',
  //   //newUser: '/signup',
  // },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
    CredentialsProvider({
      name: 'Credentials',
      // credentials: {
      //   email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
      //   password: { label: 'Password', type: 'password' },
      // },
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials /*, req*/) {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          })
          if (user) {
            // feels hacky, did this to corret TS error @ bcrypt.compare line on line 60...
            if (!credentials?.password || !user.password) {
              return null
            }
            const hash = user?.password
            const password = credentials?.password
            const result = await bcrypt.compare(password, hash)
            if (result) {
              return user
            }
            throw new Error('Invalid password')

            ///('Wrong password')
          }
          return null
        } catch (error) {
          console.log(error)
          return null

          // maybe throw an error instead?
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
