// Story markup lives in src/sections/<id>.html, behaviour in src/init.js
import { section } from './render.js';
import PageExtrasHtml from './sections/listingx.html?raw';
import RatingDisplayHtml from './sections/rating.html?raw';
import RatingBreakdownHtml from './sections/ratingx.html?raw';
import AmenityRowsHtml from './sections/amenities.html?raw';
import ReviewsHtml from './sections/reviews.html?raw';
import HostCardHtml from './sections/host.html?raw';
import HostCardV2Html from './sections/hostx.html?raw';
import ReservationCardHtml from './sections/reservation.html?raw';
import ThingsToKnowHtml from './sections/ttk.html?raw';
import TranslationPatternHtml from './sections/translate.html?raw';

export default { title: "Listing detail" };

export const PageExtras = {
  name: "Page extras",
  render: () => section('listingx', PageExtrasHtml),
};

export const RatingDisplay = {
  name: "Rating display",
  render: () => section('rating', RatingDisplayHtml),
};

export const RatingBreakdown = {
  name: "Rating breakdown",
  render: () => section('ratingx', RatingBreakdownHtml),
};

export const AmenityRows = {
  name: "Amenity rows",
  render: () => section('amenities', AmenityRowsHtml),
};

export const Reviews = {
  name: "Reviews",
  render: () => section('reviews', ReviewsHtml),
};

export const HostCard = {
  name: "Host card",
  render: () => section('host', HostCardHtml),
};

export const HostCardV2 = {
  name: "Host card v2",
  render: () => section('hostx', HostCardV2Html),
};

export const ReservationCard = {
  name: "Reservation card",
  render: () => section('reservation', ReservationCardHtml),
};

export const ThingsToKnow = {
  name: "Things to know",
  render: () => section('ttk', ThingsToKnowHtml),
};

export const TranslationPattern = {
  name: "Translation pattern",
  render: () => section('translate', TranslationPatternHtml),
};
