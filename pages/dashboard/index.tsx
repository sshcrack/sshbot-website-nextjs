import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const IndexPage = () => {
  const [session, loading] = useSession()
  const router = useRouter();
  if (loading && typeof window !== 'undefined') return null;
  if (typeof window !== 'undefined' && !session) router.push("/");
  console.log(session);

  return (<Layout title="Dashboard | sshbot">
    <h1>Dashboard</h1>
  </Layout>)
}

export default IndexPage