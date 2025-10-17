import Page from '../template/page.ts';

export default class Header extends Page {
  async render(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.id = this.id;

    // Add styles directly to container
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '15px';
    container.style.backgroundColor = '#2b2b2bff';
    container.style.boxShadow = '0 4px 8px rgba(24, 24, 24, 1)';
    container.style.marginTop = '5px';
    container.style.marginLeft = 'auto';
    container.style.marginRight = 'auto';
    container.style.fontFamily = '"Press Start 2P", cursive'; // pixel font

    container.style.zIndex = '1000';

    // Inject inner HTML
    container.innerHTML = `
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

      <h1>Transcendance</h1>

      <div style="
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
      ">
        <button id="homeBtn" >Home</button>
        <button id="playBtn" >Play</button>
        <button id="leaderboardBtn" >Leaderboard</button>
        <button id="friendsBtn">Friends</button>
      </div>
    `;

    // Button event handlers
    container.querySelector('#leaderboardBtn')?.addEventListener('click', () => {
      this.router.navigate('/leaderboard');
    });
    container.querySelector('#homeBtn')?.addEventListener('click', () => {
      this.router.navigate('/');
    });
    container.querySelector('#playBtn')?.addEventListener('click', () => {
      this.router.navigate('/play');
    });
    container.querySelector('#friendsBtn')?.addEventListener('click', () => {
      this.router.navigate('/friends');
    });

    return container;
  }
}