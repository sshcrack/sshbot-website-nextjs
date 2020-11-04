import { FilteredGuilds } from 'components/GuildsList'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'
import { isNull } from 'utils/tools'
import { isAdmin, PermLevels, ResponseInterface } from './overview'

const Guild = () => {
  const [test, setGuilds] = useState<ResponseInterface | string>()
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const { guild } = router.query

  useEffect(() => {
    if (!loading && typeof window !== "undefined" && !guild) {
      setLoading(true)
      fetch(`${window.location.protocol}//${window.location.host}/api/discord/info?id=${guild}`).then(res => {
        res.json().then(t => setGuilds(t));
      })
    }
  })

  if (typeof window === "undefined") return null;

  if (!test) return <Layout title="Dashboard | sshbot" key="Waiting">
    <h1>Loading</h1>
    <Loader type="Bars" color="#00BFFF" height={80} width={80} />
  </Layout>

  if (typeof test === "string") return <h1>{test}</h1>
  const response = test as ResponseInterface

  if (response.error === "No session") {
    router.push("/");
    return <h1>Redirecting</h1>
  }

  if (!isNull(response.error)) {
    return <Layout title="Settings | sshbot">
      <h1>ERROR</h1>
      <span>{JSON.stringify(response.error)}</span>
    </Layout>
  }

  if (isNull(response.permLevels)) {
    return <Layout title="Settings | sshbot">
      <h1>permLevels null</h1>
      <span>{response.permLevels}</span>
    </Layout>
  }

  const filtered: FilteredGuilds[] = []
  response.guilds.forEach(guild => {
    const permLevel = response.permLevels[guild.id]

    if (!isNull(permLevel))
      if (permLevel >= PermLevels.Administrator) {
        const filteredGuilds = guild as FilteredGuilds;
        filteredGuilds.permLevel = permLevel

        filtered.push(filteredGuilds)
      }

    if (isAdmin(parseInt(guild.permissions))) {
      const filteredGuilds = guild as FilteredGuilds;
      filteredGuilds.permLevel = permLevel

      filtered.push(filteredGuilds)
    }

    return undefined
  })

  const found = filtered.filter(g => g.id === guild);
  if (isNull(found) || found?.length === 0) return <Layout title="Settings">
    <h1 style={{ color: "red" }}> ACCESS DENIED</h1>
  </Layout>

  return <p>GuildID: {guild} Exists: {isNull(found) ? "undefined" : JSON.stringify(found)}</p>
}

export default Guild
