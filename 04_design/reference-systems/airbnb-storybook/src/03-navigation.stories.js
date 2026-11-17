// Story markup lives in src/sections/<id>.html, behaviour in src/init.js
import { section } from './render.js';
import TopNavHtml from './sections/topnav.html?raw';
import AccountMenuHtml from './sections/menu.html?raw';
import SearchBarHtml from './sections/search.html?raw';
import SearchExpandedAndGuestPopoverHtml from './sections/searchx.html?raw';
import CategoryStripHtml from './sections/category.html?raw';
import MobileAppPatternsHtml from './sections/app.html?raw';

export default { title: "Navigation" };

export const TopNav = {
  name: "Top nav",
  render: () => section('topnav', TopNavHtml),
};

export const AccountMenu = {
  name: "Account menu",
  render: () => section('menu', AccountMenuHtml),
};

export const SearchBar = {
  name: "Search bar",
  render: () => section('search', SearchBarHtml),
};

export const SearchExpandedAndGuestPopover = {
  name: "Search: expanded & guest popover",
  render: () => section('searchx', SearchExpandedAndGuestPopoverHtml),
};

export const CategoryStrip = {
  name: "Category strip",
  render: () => section('category', CategoryStripHtml),
};

export const MobileAppPatterns = {
  name: "Mobile app patterns",
  render: () => section('app', MobileAppPatternsHtml),
};
