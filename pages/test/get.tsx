import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';

const IndexPage = ({ cookies }: { cookies: Cookies }) => {
  return (
    <>
      My profile. Cookies:
      <ul>
        {cookies &&
          Object.entries(cookies).map(([name, value]) => (
            <li>
              {name}: {value}
            </li>
          ))}
      </ul>
    </>
  )
}

export async function getServerSideProps(ctx: NextPageContext): Promise<Props> {
  // Parse
  const cookies = parseCookies(ctx)

  // Destroy
  // destroyCookie(ctx, 'cookieName')

  return {
    props: {
      cookies
    }
  }
}

  interface Props {
    [key: string]: any
  }

  interface Cookies {
    [key: string]: string
  }

  export default IndexPage;