import { type NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { useSession } from 'next-auth/react'

// interface Item {
//   id: string
//   name: string
//   description: string
// }

const UsersPage: NextPage = () => {
  const { data: session } = useSession()
  if (session) {
    console.log('')
    console.log('============================================')
    console.log('============================================')
    console.log('session', session)
    console.log('============================================')
    console.log('============================================')
    console.log('')
  }

  const { data, isLoading } = trpc.user.users.useQuery()
  if (isLoading) {
    return <div>Loading...</div>
  }
  console.log(data)
  return (
    <div>
      <h1>Users</h1>
      {data?.map((user) => (
        <div key={user.id}>
          <div>{user.email}</div>
          <div>{user.password}</div>
        </div>
      ))}
    </div>
  )
}

export default UsersPage
