import { z } from 'zod'
import bcrypt from 'bcrypt'

import { router, publicProcedure } from '../trpc'

const SALT_ROUNDS = 10

export const userRouter = router({
  users: publicProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.prisma.user.findMany()
      return users
    } catch (e) {
      console.error(e)
      return null // return []
    }
  }),
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(), //.min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('IN CREATE MUTATION', input)
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            password: await bcrypt.hash(input.password, SALT_ROUNDS),
          },
        })

        console.log('user', user)

        return user
      } catch (error) {
        console.log(error)
        return null
      }
    }),
})
