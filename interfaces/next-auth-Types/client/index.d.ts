// Minimum TypeScript Version: 3.8
import { IncomingMessage } from 'http';

interface Session {
  user: {
    name: string;
    email: string;
    image: string;
  };
  accessToken: string;
  expires: string;
}

interface GetProvidersResponse {
  [provider: string]: Provider;
}

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

interface GenericObject {
  [key: string]: any;
}


declare function useSession(): [Session, boolean];
declare function getSession(context: NextContext): Promise<Session | null>;
declare function session(context: NextContext): Promise<Session | null>;
declare function getProviders(context: NextContext): Promise<GetProvidersResponse | null>;
declare function providers(context: NextContext): Promise<GetProvidersResponse | null>;
declare function getCsrfToken(context: NextContext): Promise<string | null>;
declare function csrfToken(context: NextContext): Promise<string | null>;
declare function signIn(provider ?: Provider | string, data ?: GenericObject): Promise<string>;
declare function signOut(context ?: NextContext | GenericObject): Promise<string>;
declare function Provider(_ref11: any): React.FunctionComponentElement<React.ProviderProps<any>>;

export { useSession, getSession, Session, getProviders, providers, getCsrfToken, csrfToken, signIn, signOut, Provider };

/**
 * TODO: `dtslint` throws when parsing Next types... the following types are copied directly from `next/types` ...
 * @see https://github.com/microsoft/dtslint/issues/297
 */

interface NextApiRequest extends IncomingMessage {
  query: {
    [key: string]: string | string[];
  };
  cookies: {
    [key: string]: string;
  };
  body: any;
  env: Env;
}

interface NextContext {
  req: NextApiRequest;
}

interface Env {
  [key: string]: string;
}
