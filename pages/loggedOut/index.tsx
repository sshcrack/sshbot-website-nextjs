import LoadingDots from 'components/LoadingDots';
import { useRouter } from 'next/router';
import styles from "../../styles/loggedOut.module.scss"

function ActiveLink() {
  if (typeof window !== 'undefined') {
    const router = useRouter()

    setTimeout(() => { router.push("/") }, 2000);
  }

  return (
    <div className={styles.root}>
      <h1>Logged out. Redirecting</h1>
      <LoadingDots type="h1" />
    </div>
  )
}

export default ActiveLink
