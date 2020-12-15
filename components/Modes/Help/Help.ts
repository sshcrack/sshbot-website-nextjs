import Swal from "sweetalert2";

export class Help {
  static defaultLogging() {
    Swal.fire({
      icon: "info",
      html: `
      <p>Detailed Logging means for example user joins, message deletions, message updates,...</p>
      <br>
      <p>With it disabled you get only important information like Temp-Bans, Bans, Mutes,...</p>
      <img src="https://i.imgur.com/6fJPr2Z.png" alt="Detailed Logging Example" style="width: 100%;">
      `
    })
  }

  static levelUpChannel() {
    Swal.fire({
      html: `
      <p>Set the Channel for Level-Up Messages</p>
      <img src="https://i.imgur.com/PqJxQZw.png" alt="Level-Up Channel Example" style="width: 100%;">
      `,
      icon: "info"
    })
  }

  static privateChannels() {
    Swal.fire({
      html: `
      <p>Set channel for private Channels</p>
      <img src="https://i.imgur.com/NFB6VQs.png" alt="Private Channels Example" style="width: 100%;">
      `,
      icon: "info"
    })
  }

  static welcomeChannel() {
    Swal.fire({
      html: `
      <p>Channel for Welcome Messages</p>
      <img src="https://i.imgur.com/Dp7jygD.png" alt="Welcome Channel Example" style="width: 100%;">
      `,
      icon: "info"
    })
  }

  static joinMessage() {
    Swal.fire({
      html: `
      <p>Message, which should be send, when users join.</p>
      <p>Variables are {{user}}, {{guildname}} and {{membercount}}</p>
      `,
      icon: "info"
    })
  }

  static leaveMessage() {
    Swal.fire({
      html: `
      <p>Message, which should be send, when users leave.</p>
      <p>Variables are {{user}}, {{guildname}} and {{membercount}}</p>
      `,
      icon: "info"
    })
  }

  static welcomeImage() {
    Swal.fire({
      html: `
      <p>Weather the bot should send an welcome image</p>
      <img src="https://i.imgur.com/RXQzsTh.png" alt="Welcome Image Example" style="width: 100%;">
      `,
      icon: "info"
    })
  }

  static prefixMessage() {
    Swal.fire({
      html: `
      <p>The prefix of the bot. (The symbol sequence in front of commands)</p>
      `,
      icon: "info"
    })
  }
}

