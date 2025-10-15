// src/main/index.ts (main page of trans)
import Page from '../template/page.ts';
import Header from '../pages/header.ts';

export default class MainPage extends Page {
  async render(): Promise<HTMLElement> 
  {
    const container = document.createElement('div');
    container.id = this.id;

    // header
    if (true == true /* isAuthenticated && this.id !== 'auth-page'*/)
    {
      const header = new Header('header', this.router);
      const headerElement = await header.render();
      container.appendChild(headerElement);
    }


    // brrr
    const content = document.createElement('div');
    content.innerHTML = `<button>brrr</button>`;
    container.appendChild(content);


    return container;
  }
}
