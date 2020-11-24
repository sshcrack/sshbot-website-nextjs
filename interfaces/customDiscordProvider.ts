
export default function customDiscord(options: Options) {
    return {
        id: 'custom_discord',
        name: 'CustomDiscord',
        type: 'oauth',
        version: '2.0',
        scope: 'identify guilds',
        params: { grant_type: 'authorization_code' },
        accessTokenUrl: 'https://discordapp.com/api/oauth2/token',
        authorizationUrl:
            'https://discordapp.com/api/oauth2/authorize?response_type=code&prompt=none',
        profileUrl: 'https://discordapp.com/api/users/@me',
        profile: (profile: Profile) => {
            return {
                id: profile.id,
                name: profile.username,
                image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            }
        },
        ...options
    }
}

interface Profile {
    id: string,
    username: string,
    avatar: string
}

interface Options {
    clientId: string,
    clientSecret: string
}

export interface customSession {
    accessToken: string,
    expires: string,
    user: {
        id: string;
        name: string;
        image: string;
    },
}