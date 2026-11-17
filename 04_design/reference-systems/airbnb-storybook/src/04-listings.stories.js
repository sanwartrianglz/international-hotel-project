// Story markup lives in src/sections/<id>.html, behaviour in src/init.js
import { section } from './render.js';
import PropertyCardHtml from './sections/property.html?raw';
import ExperienceCardHtml from './sections/experience.html?raw';
import CarouselRailHtml from './sections/carousel.html?raw';
import BadgesAndTagsHtml from './sections/badges.html?raw';
import MapPinsAndControlsHtml from './sections/map.html?raw';

export default { title: "Listings" };

export const PropertyCard = {
  name: "Property card",
  render: () => section('property', PropertyCardHtml),
};

export const ExperienceCard = {
  name: "Experience card",
  render: () => section('experience', ExperienceCardHtml),
};

export const CarouselRail = {
  name: "Carousel rail",
  render: () => section('carousel', CarouselRailHtml),
};

export const BadgesAndTags = {
  name: "Badges & tags",
  render: () => section('badges', BadgesAndTagsHtml),
};

export const MapPinsAndControls = {
  name: "Map pins & controls",
  render: () => section('map', MapPinsAndControlsHtml),
};
