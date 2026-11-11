// Story markup lives in src/sections/<id>.html, behaviour in src/init.js
import { section } from './render.js';
import ColorsHtml from './sections/colors.html?raw';
import TypographyHtml from './sections/typography.html?raw';
import SpacingHtml from './sections/spacing.html?raw';
import RadiusHtml from './sections/radius.html?raw';
import ElevationAndScrimHtml from './sections/elevation.html?raw';
import PhotoIconsHtml from './sections/photoicons.html?raw';

export default { title: "Foundations" };

export const Colors = {
  name: "Colors",
  render: () => section('colors', ColorsHtml),
};

export const Typography = {
  name: "Typography",
  render: () => section('typography', TypographyHtml),
};

export const Spacing = {
  name: "Spacing",
  render: () => section('spacing', SpacingHtml),
};

export const Radius = {
  name: "Radius",
  render: () => section('radius', RadiusHtml),
};

export const ElevationAndScrim = {
  name: "Elevation & scrim",
  render: () => section('elevation', ElevationAndScrimHtml),
};

export const PhotoIcons = {
  name: "Photo icons (3D)",
  render: () => section('photoicons', PhotoIconsHtml),
};
