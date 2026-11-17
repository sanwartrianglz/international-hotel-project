// Story markup lives in src/sections/<id>.html, behaviour in src/init.js
import { section } from './render.js';
import IntroductionHtml from './sections/intro.html?raw';
import FileVsLiveSiteHtml from './sections/livediff.html?raw';

export default { title: "Docs" };

export const Introduction = {
  name: "Introduction",
  render: () => section('intro', IntroductionHtml),
};

export const FileVsLiveSite = {
  name: "File vs live site",
  render: () => section('livediff', FileVsLiveSiteHtml),
};
