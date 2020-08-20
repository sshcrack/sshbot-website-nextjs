import Layout from '../components/Layout'
import ConsoleText from '../components/ConsoleText'
import styles from "../styles/index.module.scss";
import Discord from "../assets/svg/discordGradient.svg"
import Link from 'next/link';
import LoadingDots from 'components/LoadingDots';

const IndexPage = () => {
  return (
    <Layout title="Home | sshbot">
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h1>A bot for&nbsp;</h1>
          <ConsoleText type="h1" keepMiddle={true} inputClass={styles.consoleInput} sharedClass={styles.console} text={[
            {
              rules: {
                "background-image": "linear-gradient( 106.4deg,  rgba(255,104,192,1) 11.1%, rgba(104,84,249,1) 81.3% )"
              },
              name: "Music"
            },
            {
              rules: {
                "background-image": "radial-gradient( circle farthest-corner at 10% 20%,  rgba(253,193,104,1) 0%, rgba(251,128,128,1) 90% )",

              },
              name: "Economy"
            },
            {
              rules: {
                "background-image": "linear-gradient( 109.6deg,  rgba(255,194,48,1) 11.2%, rgba(255,124,0,1) 100.2% )",
              },
              name: "Moderation"
            }
          ]} />
        </div>

        <div className={styles.buttonWrapper}>
          <button className={styles.joinButton}>
            <Link href="/api/auth/guild">
              <a>
                <Discord />
              </a>
            </Link>
          </button>
        </div>
      </div >
    </Layout >
  )
}

export default IndexPage
