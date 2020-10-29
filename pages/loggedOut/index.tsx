import LoadingDots from 'components/LoadingDots';
import { useRouter } from 'next/router';

function ActiveLink() {
  if (typeof window !== 'undefined') {
    const router = useRouter()

    setTimeout(() => { router.push("/") }, 2000);
  }

  return (
    <div className={`center`} id="content-wrapper">
      <div style={{flexDirection: "row", display: "flex"}}>
        <h1>Logged out. Redirecting</h1>
        <LoadingDots type="h1"/>
      </div>
    </div>
  )
}

export default ActiveLink
