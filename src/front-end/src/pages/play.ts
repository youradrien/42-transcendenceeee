import Page from '../template/page.ts';
import SinglePong from '../component/singlePong.ts';

export default class PlayPage extends Page {
  async render(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.id = this.id;

    container.innerHTML = `
      <div id="play-content" style="
        width: 100%;
        height: 100vh;
        padding: 2rem;
        text-align: center;
        font-family: 'Press Start 2P', cursive;
        position: relative;
      ">
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

        <h2>🎮 Play Pong</h2>
        <p id="player-status">Looking for players...</p>

        <div style="margin-top: 2rem; position: relative;">
          <button id="singleBtn" style="margin: 1rem;">🎯 SINGLE-Player</button>

          <div style="display: inline-block; position: relative;">
            <button id="multiBtn" style="margin: 1rem; position: relative;">
              🚀 Queue for Match
            </button>
            <span id="queue-count" style="
              position: absolute;
              top: -10px;
              right: -10px;
              background: #00ff00;
              color: black;
              font-size: 10px;
              padding: 4px 6px;
              border-radius: 10px;
              font-weight: bold;
              box-shadow: 0 0 6px rgba(0,0,0,0.4);
            ">0</span>
          </div>
        </div>
      </div>
    `;

    // Fetch number of players searching
    try {
      const res = await fetch('http://localhost:3010/api/pong/status', {
        credentials: 'include'
      });
      const data = await res.json();
      const sss = container.querySelector('#player-status') as HTMLParagraphElement;
      const qc = container.querySelector('#queue-count') as HTMLSpanElement;
      const online = data?.data?.onlinePlayers ?? 0;
      sss.innerText = `🟢 ${online} player(s) in queue`;
      qc.innerText = String(online);
    } catch (err) {
      const sss = container.querySelector('#player-status') as HTMLParagraphElement;
      sss.innerText = '⚠️ Could not load player status';
    }

    // Single player button handler
    const s = container.querySelector('#singleBtn') as HTMLButtonElement;
    s.onclick = async () => {
      const sp = new SinglePong('single-player', this.router);
      const ss = await sp.render();
      container.innerHTML = '';
      container.appendChild(ss);
    };

    // Multiplayer (queue) button handler
    const multiBtn = container.querySelector('#multiBtn') as HTMLButtonElement;
    multiBtn.onclick = () => {
      try {
        // const socket = new WebSocket('ws://localhost:3010/api/pong');
        // const res = await fetch('http://localhost:3010/api/pong/status', {
        //   credentials: 'include'
        // });
      } catch (err) {
      }
    };

    return container;
  }
}
