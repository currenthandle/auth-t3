import { z } from 'zod'

import { router, publicProcedure } from '../trpc'

export const userRouter = router({
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
            password: input.password,
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
