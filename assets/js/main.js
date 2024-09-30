function addStylesAndHTMLToBody() {
  //const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/style-desktop.css'; 
    document.head.appendChild(link);

    document.body.innerHTML = `
      <div id="game-container">
        <div id="board">
          <canvas id="gameCanvas"></canvas>
        </div>
        <div id="info">
          <div>
            <h3>NEXT</h3>
            <canvas id="nextColumn"></canvas>
          </div>
          <div>
            <h3>SCORE</h3>
            <canvas id="score"></canvas>
          </div>
          <div>
            <h3>LEVEL</h3>
            <canvas id="level"></canvas>
          </div>
          <div id="controls">
            <h3>CONTROLS</h3>
            <p>move: ← ↓ →</p>
            <p>rotate: ↑</p>
            <p>pause: [space]</p>
          </div>
        </div>
      </div>
      <footer>
        <p>Developed by Alex Martínez</p>
        <a href="https://www.linkedin.com/in/alejandromartinez-webdeveloper/"><i class="fa-brands fa-linkedin fa-xl"></i></a>
        <a href="https://github.com/alexmvarela"><i class="fa-brands fa-github fa-xl"></i></a>
        <a href="https://alexmvarela.github.io/portfolio/"><i class="fa-solid fa-briefcase fa-xl" style="color: #ffffff;"></i></a>
      </footer>
    `;

    document.addEventListener('DOMContentLoaded', () => {
      const script = document.createElement('script');
      script.src = 'assets/js/script-desktop.js';
      document.body.appendChild(script);
    });

  } else {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/style-mobile.css'; 
    document.head.appendChild(link);

    document.body.innerHTML = `
      <div id="game-container">
        <div id="board">
          <canvas id="gameCanvas"></canvas>
        </div>
        <div id="info">
          <div>
            <h3>NEXT</h3>
            <canvas id="nextColumn"></canvas>
          </div>
          <div>
            <h3>SCORE</h3>
            <canvas id="score"></canvas>
          </div>
          <div>
            <h3>LEVEL</h3>
            <canvas id="level"></canvas>
          </div>
          <button id="start-pause"><i class="fa-solid fa-play fa-2xl" style="color: white;"></i> <i class="fa-solid fa-pause fa-2xl" style="color: white;"></i></button>
        </div>
      </div>
      <div id="controls">
        <div>
          <button id="left"><i class="fa-solid fa-arrow-left-long fa-2xl" style="color: #ffffff;"></i></button>
          <button id="rotate"><i class="fa-solid fa-arrows-spin fa-2xl" style="color: #ffffff;"></i></button>
          <button id="right"><i class="fa-solid fa-arrow-right-long fa-2xl" style="color: #ffffff;"></i></button>
        </div>
        <div>
          <button id="down"><i class="fa-solid fa-angles-down fa-2xl" style="color: #ffffff;"></i></button>
        </div>
      </div>
      <footer>
        <p>Developed by Alex Martínez</p>
        <div>
          <a href="https://www.linkedin.com/in/alejandromartinez-webdeveloper/"><i class="fa-brands fa-linkedin fa-xl" style="color: #ffffff;"></i></a>
          <a href="https://github.com/alexmvarela"><i class="fa-brands fa-github fa-xl" style="color: #ffffff;"></i></a>
          <a href="https://alexmvarela.github.io/portfolio/"><i class="fa-solid fa-briefcase fa-xl" style="color: #ffffff;"></i></a>
        </div>
      </footer>
    `;
    
    document.addEventListener('DOMContentLoaded', () => {
      const script = document.createElement('script');
      script.src = 'assets/js/script-mobile.js';
      document.body.appendChild(script);
    });
  }
}

addStylesAndHTMLToBody();
