import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import type { SyntheticEvent } from 'react'
import { useState } from 'react'
import { trpc } from '../utils/trpc'

export default function SignUp() {
  const router = useRouter()
  const { mutate /*, error */ } = trpc.user.signUp.useMutation({
    onSuccess: () => {
      signIn('credentials', {
        email: authState.email,
        password: authState.password,
        redirect: false,
      }).then((resp) => {
        if (resp?.ok) {
          router.push('/')
        } else {
          setPageState((old) => ({
            ...old,
            processing: false,
            error: resp?.error || 'Unknown error',
          }))
        }
      })
    },
    onError: (err) => {
      console.error(err)
    },
  })
  const [authState, setAuthState] = useState({
    email: '',
    password: '',
  })
  const [pageState, setPageState] = useState({
    error: '',
    processing: false,
  })

  const handleFieldChange = (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & {
      id: string
      value: string
    }
    setAuthState((old) => ({ ...old, [target.id]: target.value }))
    console.log('authState', authState)
  }
  const handleSignUp = async () => {
    setPageState((old) => ({ ...old, processing: true, error: '' }))
    // call trpc router mutation from client here
    mutate({
      ...authState,
      // redirect: false
    })
  }
  return (
    <div>
      <form>
        <label htmlFor='email'>Email</label>
        <input
          onChange={handleFieldChange}
          className='border-4'
          type='email'
          name='email'
          id='email'
        />
        <br />
        <label htmlFor='password'>Password</label>
        <input
          onChange={handleFieldChange}
          className='border-4'
          type='password'
          name='password'
          id='password'
        />
        <br />
        <button
          disabled={pageState.processing}
          onClick={handleSignUp}
          type='submit'
        >
          Sign up
        </button>
      </form>
    </div>
  )
}
