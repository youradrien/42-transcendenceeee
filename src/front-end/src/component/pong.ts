import Page from '../template/page.ts';

export default class SinglePong extends Page {
  private multiplayer: boolean;
  private socket?: WebSocket;
  private game_data?: any;

  constructor(id: string, router: { navigate: (path: string) => void }, options?: any) {
    super(id, router, options); // ✅ Pass required args
    this.multiplayer = options?.multiplayer ?? false;
    this.socket = options?.socket;
    this.game_data = options?.game_data;

    console.log(this.socket);
    // (this.game_data);
    // console.log(this.multiplayer);
    // console.log(options);
  }

  async render(): Promise<HTMLElement> {
    const CONTAINER = document.createElement('div');
    CONTAINER.id = this.id;
    CONTAINER.style.display = 'flex';
    CONTAINER.style.flexDirection = 'column';
    CONTAINER.style.alignItems = 'center';
    CONTAINER.style.justifyContent = 'center';
    CONTAINER.style.height = '100vh';
    CONTAINER.style.textAlign = 'center';

    const _score = document.createElement('div');
    _score.style.display = 'flex';
    _score.style.justifyContent = 'space-between';
    _score.style.width = '800px';
    _score.style.marginBottom = '1rem';
    _score.style.marginTop = '4rem';
    _score.style.fontSize = '1.25rem'; 
    _score.style.letterSpacing = '1px';
    _score.id = 'score';

    const p1 = document.createElement('span');
    p1.id = 'player1-score';
    p1.textContent = 'Player 1: 0';
    _score.appendChild(p1);

    // Max score in the middle
    const max_score = document.createElement('span');
    max_score.id = 'max-score';
    max_score.textContent = `Max Score: ${this.game_data ? this.game_data.max_score: 20}`;
    max_score.style.opacity = '0.7';
    max_score.style.fontSize = '0.85rem';
    max_score.style.flex = '1';
    max_score.style.textAlign = 'center';
    _score.appendChild(max_score);
    // [Start || leave] btn
    const s = document.createElement('button');
    if(this.multiplayer)
    {
      s.textContent = 'GIVE-UP';
      s.style.backgroundColor = '#1383e4ff';
      s.style.color = '#0000000';
    }else
      s.textContent = 'Start Game';
    s.id = 'pong_btn';
    s.style.fontSize = '0.85rem';
    _score.appendChild(s);

    const p2 = document.createElement('span');
    p2.id = 'player2-score';
    p2.textContent = 'Player 2: 0';
    _score.appendChild(p2);
    CONTAINER.appendChild(_score);
    const c = document.createElement('canvas');
    c.id = 'pongCanvas';
    c.width = 800;  // Set your desired width
    c.height = 600; // Set your desired height
    CONTAINER.appendChild(c);


    this.initPong(c, s, p1, p2);
    return CONTAINER;
  }

  private initPong(canvas: HTMLCanvasElement, startButton: HTMLButtonElement, p1ScoreEl: HTMLElement, p2ScoreEl: HTMLElement): void {
    const ctx = canvas.getContext('2d')!;
    if (!ctx) {
      return;
    }

    // [GAME] state...
    // and constants
    let g_started = false;
    const PADDLE_WIDTH = 10, PADDLE_HEIGHT = 80, PADDLE_SPEED = 5;
    const BALL_RADIUS = 10, DEFAULT_BALL_SPEED = 5;
    const _g = {
      ball: { x: canvas.width / 2, y: canvas.height / 2, speedX: DEFAULT_BALL_SPEED, speedY: DEFAULT_BALL_SPEED },
      paddles: { player1Y: canvas.height / 2 - PADDLE_HEIGHT / 2, player2Y: canvas.height / 2 - PADDLE_HEIGHT / 2 },
      score: { player1: 0, player2: 0 },
      keys: { w: false, s: false, ArrowUp: false, ArrowDown: false, ' ': false },
      player_names: ["Player_1", "Player_2"],
      max_score: 20,
      ended: false
    };
    if(this.multiplayer)
    {
      if(this.game_data)
      {
        _g.player_names = this.game_data?.player_names;
        _g.max_score = this.game_data?.max_score;
      }
    }

    const PONG_ART = 
    `██████╗ ███████╗███╗   ██╗ ██████╗ 
      ██╔══██╗██║   ██║████╗  ██║██╔════╝ 
      ██████╔╝██║   ██║██╔██╗ ██║██║  ███╗
      ██╔═══╝ ██║   ██║██║╚██╗██║██║   ██║
      ██║     ╚██████╔╝██║ ╚████║╚██████╔╝
      ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝`;

    startButton.addEventListener('click', () => {
      if(this.multiplayer)
      {
        console.log("leave");
        if(_g.ended)
            return ;
        if(this.socket){
          this.socket.send(JSON.stringify({
                type: "player_giveup"
            }));
        }
      }else
      {
        if(!g_started) {
          g_started = true;
          reset_ball(true);
        }
      }
    });

    const reset_ball = (initialReset = false) => {
      _g.ball.x = canvas.width / 2;
      _g.ball.y = canvas.height / 2;
      _g.ball.speedX = initialReset ? DEFAULT_BALL_SPEED : -_g.ball.speedX;
      _g.ball.speedY = DEFAULT_BALL_SPEED;
    };

    /*const treat_socket = async () => 
    {*/
      if(!this.socket)
          return ;
      this.socket.addEventListener('message', async (msg) => {
        if(_g.ended)
          return ;
        // console.log("ws msg:", msg);
        const data = await JSON.parse(msg.data);
        // handle queue, creating, etc...
        if (data?.type === "game_state"){
            if(data?.ball)
            {
              _g.ball.x = data?.ball.x;
              _g.ball.y = data?.ball.y;
            }
            if(data?.scores)
            {
              _g.score.player1 = data?.scores.p1;
              _g.score.player2 = data?.scores.p2;

              p1ScoreEl.textContent = `${_g.player_names[0]}: ${_g.score.player1}`;
              p2ScoreEl.textContent = `${_g.player_names[1]}: ${_g.score.player2}`;
            }
            if(data?.paddles)
            {
              _g.paddles.player1Y = data?.paddles.p1;
              _g.paddles.player2Y = data?.paddles.p2;
            }
        }
        if(data?.type === "game_end")
        {
          const E = document.querySelector('#max-score') as HTMLParagraphElement;
          E.innerHTML = '';
          _g.ended = (true);

        } 
      });

    //}
    //treat_socket();

    const update = () => {
      if(this.multiplayer)
      {
        if(!this.socket)
            return;
        // update() state happens in tereat_socket() via ws
        // only keyboard inputs are sent in this update() loop
        let direction = null;
        if (_g.keys.ArrowUp || _g.keys.w  ){
          direction = "up";
        }
        if(_g.keys.ArrowDown || _g.keys.s ){
          direction = "down";
        }
        if(direction)
        {
          this.socket.send(JSON.stringify({
              type: "paddle_move",
              direction: direction
          }));
        }
      }else
      {
        if (!g_started) return;

        // ball
        _g.ball.x += _g.ball.speedX;
        _g.ball.y += _g.ball.speedY;

        // paddles
        if (_g.keys.ArrowUp && _g.paddles.player2Y > 0 + PADDLE_SPEED) _g.paddles.player2Y -= PADDLE_SPEED;
        if (_g.keys.ArrowDown &&  _g.paddles.player2Y < canvas.height - PADDLE_SPEED) _g.paddles.player2Y += PADDLE_SPEED;

        // ball -> top/bottom walls
        if (_g.ball.y + BALL_RADIUS > canvas.height || _g.ball.y - BALL_RADIUS < 0) {
          _g.ball.speedY = -_g.ball.speedY;
        }

        _paddle_collision(_g.paddles.player1Y, 20 + PADDLE_WIDTH, 1);
        _paddle_collision(_g.paddles.player2Y, canvas.width - 30, -1);

        if (_g.ball.x + BALL_RADIUS > canvas.width) {
          _g.score.player1++;
          p1ScoreEl.textContent = `Player 1: ${_g.score.player1}`;
          _g.ball.speedX = - (_g.ball.speedX);
        } else if (_g.ball.x - BALL_RADIUS < 0) {
          _g.score.player2++;
          p2ScoreEl.textContent = `Player 2: ${_g.score.player2}`;
          _g.ball.speedX = - (_g.ball.speedX);
        }
      }

    };

    const _paddle_collision = (paddleY: number, paddleX: number, direction: 1 | -1) => {
        const b = _g.ball;
        const paddleCollision = direction === 1
            ? b.x - BALL_RADIUS < paddleX
            : b.x + BALL_RADIUS > paddleX;

        if (paddleCollision && b.y > paddleY && b.y < paddleY + PADDLE_HEIGHT)
        {
            const inter_y = ( paddleY + PADDLE_HEIGHT / 2 - b.y) / (PADDLE_HEIGHT / 2);

            b.speedX = DEFAULT_BALL_SPEED * Math.cos(inter_y * (Math.PI / 3)) * direction;
            b.speedY = DEFAULT_BALL_SPEED * -Math.sin(inter_y * (Math.PI / 3));
            b.speedX *= 1.025;
            b.speedY *= 1.025;
        }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // field
      ctx.strokeStyle = _g.ended ? 'green' : 'white';
      ctx.lineWidth = 5;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // PONG title with transparency
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = 'white';
      ctx.font = '32px "Courier New", Courier, monospace';
      ctx.textAlign = 'center';
      const lines = PONG_ART.split('\n');
      const lineHeight = 35;
      const startY = (canvas.height - (lines.length * lineHeight)) / 2 + lineHeight;
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
      });
      ctx.restore();
      // ball
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(_g.ball.x, _g.ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      // paddles
      ctx.fillRect(20, _g.paddles.player1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(canvas.width - 30, _g.paddles.player2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    };

    const gameLoop = () => {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    };

    // Event Listeners
    const handleKeyEvent = (e: KeyboardEvent, isDown: boolean) => {
      if (e.key === ' ' && isDown && !g_started) {
        /* e.preventDefault();
        g_started = true;
        reset_ball(true); */
      }
      // Check for movement keys
      else if (e.key === 'w' || e.key === 's' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault(); // ✅ Prevent arrow keys and WASD from scrolling
        // console.log(`Key ${e.key} is now ${isDown ? 'down' : 'up'}`);
        (_g.keys as any)[e.key] = isDown;
      }
    };
    document.addEventListener('keydown', (e) => handleKeyEvent(e, true));
    document.addEventListener('keyup', (e) => handleKeyEvent(e, false));

    gameLoop();
  }
}