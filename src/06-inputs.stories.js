// Story markup lives in src/sections/<id>.html, behaviour in src/init.js
import { section } from './render.js';
import DatePickerHtml from './sections/datepicker.html?raw';
import TwoMonthCalendarHtml from './sections/calx.html?raw';
import TextInputHtml from './sections/inputs.html?raw';
import FilterChipsHtml from './sections/chips.html?raw';
import FiltersModalHtml from './sections/filters.html?raw';

export default { title: "Inputs" };

export const DatePicker = {
  name: "Date picker",
  render: () => section('datepicker', DatePickerHtml),
};

export const TwoMonthCalendar = {
  name: "Two-month calendar",
  render: () => section('calx', TwoMonthCalendarHtml),
};

export const TextInput = {
  name: "Text input",
  render: () => section('inputs', TextInputHtml),
};

export const FilterChips = {
  name: "Filter chips",
  render: () => section('chips', FilterChipsHtml),
};

export const FiltersModal = {
  name: "Filters modal",
  render: () => section('filters', FiltersModalHtml),
};
