import { NextPageContext } from 'next';
import { useRouter } from 'next/router'
import { Mode } from './[mode]';

function GuildRedirect({ }) {
  const router = useRouter()
  const { guild } = router.query;

  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(`/dashboard/${guild}/${Object.keys(Mode)[0].toLowerCase()}`);
    return <></>;
  }

  return <></>;
}

GuildRedirect.getInitialProps = (ctx: NextPageContext) => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    const { guild } = ctx.query;
    ctx.res.writeHead(302, { Location: `/dashboard/${guild}/${Object.keys(Mode)[0].toLowerCase()}` });
    ctx.res.end();
  }
  return { };
}

export default GuildRedirect
