export interface MusicEvents {
  'setPaused': (paused: boolean) => void;
  'result': (data: MusicData) => void;
  'getQueue': () => void;
  'startListening': () => void;
  'stopListening': () => void;
  'queueInfo': (data: DataQueue) => void;
  'getPlaying': () => void;
  'guildID': (id: String) => void;
}

export interface DataQueue {
  event: any,
  data?: any
}

export interface MusicData {
  state: State,
  result?: any,
  error: boolean,
  info?: string
}

export type State = keyof MusicEvents;

export interface QueueResult {
  guildID:              string;
  playing:              Playing;
  tracks:               Playing[];
  stopped:              boolean;
  lastSkipped:          boolean;
  volume:               number;
  paused:               boolean;
  repeatMode:           boolean;
  filters:              { [key: string]: boolean };
  additionalStreamTime: string;
}

export interface Playing {
  playTime?:    number;
  name:         string;
  url:          string;
  duration:     string;
  rawDuration:  number;
  thumbnail:    string;
  author:       string;
  requestedBy:  RequestedBy;
  fromPlaylist: boolean;
}

export interface RequestedBy {
  id:                   string;
  system:               null;
  locale:               null;
  flags:                number;
  username:             string;
  bot:                  boolean;
  discriminator:        string;
  avatar:               string;
  lastMessageChannelID: string;
  createdTimestamp:     number;
  defaultAvatarURL:     string;
  tag:                  string;
  avatarURL:            string;
  displayAvatarURL:     string;
}