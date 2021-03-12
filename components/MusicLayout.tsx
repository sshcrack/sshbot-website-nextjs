import { QueueResult } from 'interfaces/musicEvents'
import { ReactNode } from 'react'
import styles from "styles/musicLayout.module.scss"

export const MusicLayout = ({ children }: { children: ReactNode }) => {
  return <>
    {children}
  </>
}

export const QueueList = ({ refresh, queue, children }: QueueProps) => {
  if (!queue)
    return <span>Nothing in queue. Click <a href="#" onClick={() => refresh()}>here</a> to refresh</span>

  const tracks: JSX.Element[] = []
  queue.tracks.forEach(track => {
    const key = "track-" + track.author + "-" + track.name + "-" + track.rawDuration
    const splitted = track.name.split(" - ")
    const author = splitted.shift();
    const title = splitted.join(" - ")
    const requestedBy = track.requestedBy;
    tracks.push(<div key={key} className={styles.track}>
      <img src={track.thumbnail} className={styles.thumbnail} />
      <div className={styles.titleDiv}>
        <span className={styles.trackAuthor}>{author}</span>
        <span className={styles.trackName}>{title}</span>

      </div>
      <div className={styles.footer}>
          <img src={requestedBy.avatarURL ?? requestedBy.defaultAvatarURL} className={styles.avatar} />
          <span>{ requestedBy.tag}</span>
        </div>
    </div>)
  });

  return <div className={styles.root}>
    {tracks}
    {children}
  </div>
}

interface QueueProps {
  refresh: () => void,
  queue: QueueResult | undefined,
  children: ReactNode
}