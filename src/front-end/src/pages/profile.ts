import Page from '../template/page.ts';

export default class UserProfilePage extends Page {
  async render(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.id = this.id;

    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '40px';
    container.style.backgroundColor = '#222'; // dark background
    container.style.color = '#fff';
    container.style.fontFamily = '"Press Start 2P", cursive'; // pixel font
    container.style.minHeight = '100vh';

    container.innerHTML = `
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #1c1c1c;
        padding: 30px;
        border: 2px solid #333;
        width: 700px;
        border-radius: 8px;
      ">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="https://avatars.githubusercontent.com/u/9919?s=200&v=4" alt="User Avatar"
            style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid #fff;" />
          <h1 style="font-size: 28px; margin: 0; color: white;">BATMAN</h1>
        </div>

        <div style="display: flex; margin-top: 30px; gap: 30px; flex-wrap: wrap; justify-content: center;">

          <!-- Game History -->
          <div style="flex: 1; min-width: 300px; border: 2px solid #333; padding: 16px;">
            <h2 style="margin: 0 0 16px 0;">GAME HISTORY</h2>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
              <span style="color: lime;">WINNER</span>
              <span style="color: red;">LOSER</span>
            </div>
            <div style="background: #222; padding: 8px; margin-bottom: 6px;">NIL.0 &nbsp;&nbsp;&nbsp; BATMAN</div>
            <div style="background: #222; padding: 8px; margin-bottom: 6px;">NIL.0 &nbsp;&nbsp;&nbsp; BATMAN</div>
            <div style="background: #222; padding: 8px;">NIL.0 &nbsp;&nbsp;&nbsp; BATMAN</div>
          </div>

          <!-- Stats and Buttons -->
          <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 20px;">
            
            <div style="display: flex; gap: 12px;">
              <button style="${greenButtonStyle}">ADD FRIEND</button>
              <button style="${greenButtonStyle}">SEND DM</button>
            </div>

            <div style="border: 2px solid #333; padding: 16px;">
              <h3 style="margin: 0 0 12px 0;">WINS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOSSES</h3>
              <div style="font-size: 16px;">
                <span style="color: lime;">0</span> &nbsp;&nbsp;&nbsp;&nbsp;
                <span style="color: red;">3</span>
              </div>
            </div>

            <!-- Achievements -->
            <div style="border: 2px solid #333; padding: 16px;">
              <h3 style="margin: 0 0 12px 0;">ACHIEVEMENTS</h3>
              <div style="display: grid; grid-template-columns: repeat(3, 40px); gap: 12px;">
                <div style="width: 40px; height: 40px; background: #fff;"></div>
                <div style="width: 40px; height: 40px; background: #666;"></div>
                <div style="width: 40px; height: 40px; background: #666;"></div>
                <div style="width: 40px; height: 40px; background: #333;"></div>
                <div style="width: 40px; height: 40px; background: #333;"></div>
                <div style="width: 40px; height: 40px; background: #333;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return container;
  }
}

// ✅ Green pixel-style button
const greenButtonStyle = `
  background-color: #0f0;
  color: black;
  font-weight: bold;
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
  padding: 10px 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 6px #0f0;
  transition: transform 0.2s ease;
}
button:hover {
  transform: scale(1.05);
}
`;