// Story markup lives in src/sections/<id>.html, behaviour in src/init.js
import { section } from './render.js';
import ButtonsHtml from './sections/buttons.html?raw';
import DarkGreyAndGradientButtonsHtml from './sections/livebuttons.html?raw';
import IconButtonsHtml from './sections/iconbuttons.html?raw';

export default { title: "Actions" };

export const Buttons = {
  name: "Buttons",
  render: () => section('buttons', ButtonsHtml),
};

export const DarkGreyAndGradientButtons = {
  name: "Dark, grey & gradient buttons",
  render: () => section('livebuttons', DarkGreyAndGradientButtonsHtml),
};

export const IconButtons = {
  name: "Icon buttons",
  render: () => section('iconbuttons', IconButtonsHtml),
};
