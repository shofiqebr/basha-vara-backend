import { z } from 'zod'

const loginValidationSchema = z.object({
  body: z.object({
    // name: z.string({
    //   required_error: "Name must be provided "
    // }),
    email: z.string({
      required_error: "Email must be provided",
  }).email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
})

export const AuthValidation = {
  loginValidationSchema,
}
