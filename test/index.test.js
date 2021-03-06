/** @jsx h */

const { h } = require('@skatejs/val');
const render = require('..');

class CustomElement extends HTMLElement {
  constructor () {
    super();
    this.connectedCallback = jest.fn();
    this.disconnectedCallback = jest.fn();
  }
}
window.customElements.define('custom-element', CustomElement);

describe('window', () => {
  it('should work if re-included', () => {
    require('..');
  });

  it('Object', () => {
    expect(window.Object).toBeDefined();
    expect(window.Object).toEqual(global.Object);
  });

  describe('customElements', () => {
    it('should be an object', () => {
      expect(typeof window.customElements).toEqual('object');
    });

    it('define should add a the nodeName to the customElement', () => {
      expect(CustomElement.prototype.nodeName).toEqual('CUSTOM-ELEMENT');
    });

    it('get should return the custom element', () => {
      expect(window.customElements.get('custom-element')).toEqual(CustomElement);
    });
  });
});

describe('Node', () => {
  let host;

  beforeEach(() => {
    host = document.createElement('div');
  });

  describe('appendChild', () => {
    let m1, m2;

    it('should connect a custom element', () => {
      const node = document.createElement('custom-element');
      host.appendChild(node);
      expect(node.connectedCallback.mock.calls.length).toEqual(1);
    });

    it('should connect a fragment of elements', () => {

    });
  });

  describe('insertBefore', () => {
    it('should connect a custom element', () => {
      
    });

    it('should connect a fragment of elements', () => {
      
    });
  });

  describe('removeChild', () => {
    it('should connect a custom element', () => {
      
    });

    it('should connect a fragment of elements', () => {
      
    });
  });

  describe('replaceChild', () => {
    it('should connect a custom element', () => {
      
    });

    it('should connect a fragment of elements', () => {
      
    });
  });
});

describe('Element', () => {
  describe('attachShadow', () => {
    it('should be patched on Element', () => {
      expect(HTMLElement.prototype.hasOwnProperty('attachShadow')).toEqual(true);
    });

    it('mode: open, should create a shadowRoot property', () => {

    });

    it('mode: closed, should not create a shadowRoot property', () => {

    });
  });
  
  describe('innerHTML', () => {
    it('should get innerHTML', () => {

    });

    it('should set innerHTML', () => {
      const div = document.createElement('div');
      const html = `<h1 id="yelling">Test</h1><section><p><span id="nested-span">Paragraph</span> 1.</p><p><span>Paragraph</span> 2.</p></section>`;
      div.innerHTML = html;
      expect(div.innerHTML).toEqual(html);
    });
  });
});

describe('HTMLElement', () => {
  it('should extend Element', () => {
    expect(window.HTMLElement).toBeDefined();
  });
});

describe('render (serialisation)', () => {
  it('should call the connected callback', () => {
    const node = new CustomElement();
    return render(node).then(() => {
      expect(node.connectedCallback.mock.calls.length).toEqual(1);
    });
  });

  it('should disconnect it after serialising', () => {
    const node = new CustomElement();
    return render(node).then(() => {
      expect(node.disconnectedCallback.mock.calls.length).toEqual(1);
    });
  });

  it('renders correctly', () => {
    class Hello extends HTMLElement {
      connectedCallback () {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(<span>Hello, <x-yell><slot /></x-yell>!</span>);
      }
    }
    class Yell extends HTMLElement {
      connectedCallback () {
        Promise.resolve().then(() => {
          const shadowRoot = this.attachShadow({ mode: 'open' });
          shadowRoot.appendChild(<strong><slot /></strong>);
        });
      }
    }
    customElements.define('x-hello', Hello);
    customElements.define('x-yell', Yell);

    const hello = new Hello();
    hello.appendChild(document.createTextNode('World'));

    return render(hello).then(r => {
      expect(r).toMatchSnapshot();
    });
  });
});
