import { NextPageContext } from 'next';
import { useRouter } from 'next/router'

function GuildRedirect({ }) {
  const router = useRouter()
  const { guild } = router.query;

  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(`/dashboard/${guild}/moderation`);
    return <></>;
  }

  return <></>;
}

GuildRedirect.getInitialProps = (ctx: NextPageContext) => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    const { guild } = ctx.query;
    ctx.res.writeHead(302, { Location: `/dashboard/${guild}/moderation` });
    ctx.res.end();
  }
  return { };
}

export default GuildRedirect
