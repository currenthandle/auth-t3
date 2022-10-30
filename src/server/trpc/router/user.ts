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
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: input.password,
        },
      })
      return user
    }),
})
