import '../src/styles.css';
import sprite from '../src/photo-icons.svg.html?raw';

// Inject the 3D photo-icon sprite once so <use href="#pi-..."> works in every story.
if (!document.getElementById('pi-sprite')) {
  const holder = document.createElement('div');
  holder.id = 'pi-sprite';
  holder.innerHTML = sprite;
  document.body.prepend(holder);
}

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: { order: ['Docs', 'Foundations', 'Actions', 'Navigation', 'Listings', 'Listing detail', 'Inputs', 'Checklists', 'Page'] },
    },
    viewport: {
      options: {
        mobile: { name: 'Mobile 390', styles: { width: '390px', height: '844px' }, type: 'mobile' },
        tablet: { name: 'Tablet 820', styles: { width: '820px', height: '1180px' }, type: 'tablet' },
        desktop: { name: 'Desktop 1280', styles: { width: '1280px', height: '900px' }, type: 'desktop' },
      },
    },
    backgrounds: { disable: true },
    controls: { disable: true },
    actions: { disable: true },
  },
  decorators: [
    story => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'padding:24px;background:#f6f9fc;min-height:100vh;box-sizing:border-box';
      const s = story();
      typeof s === 'string' ? (wrap.innerHTML = s) : wrap.appendChild(s);
      return wrap;
    },
  ],
};
export default preview;
