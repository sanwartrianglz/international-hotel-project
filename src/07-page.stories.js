// Story markup lives in src/sections/<id>.html, behaviour in src/init.js
import { section } from './render.js';
import AnnouncementModalAndToastHtml from './sections/announce.html?raw';
import SkeletonLoadingHtml from './sections/skeleton.html?raw';
import FooterAndLegalHtml from './sections/footer.html?raw';
import CityLinkGridHtml from './sections/citygrid.html?raw';
import ResponsiveRulesHtml from './sections/responsive.html?raw';
import KnownGapsHtml from './sections/gaps.html?raw';

export default { title: "Page" };

export const AnnouncementModalAndToast = {
  name: "Announcement modal & toast",
  render: () => section('announce', AnnouncementModalAndToastHtml),
};

export const SkeletonLoading = {
  name: "Skeleton loading",
  render: () => section('skeleton', SkeletonLoadingHtml),
};

export const FooterAndLegal = {
  name: "Footer & legal",
  render: () => section('footer', FooterAndLegalHtml),
};

export const CityLinkGrid = {
  name: "City link grid",
  render: () => section('citygrid', CityLinkGridHtml),
};

export const ResponsiveRules = {
  name: "Responsive rules",
  render: () => section('responsive', ResponsiveRulesHtml),
};

export const KnownGaps = {
  name: "Known gaps",
  render: () => section('gaps', KnownGapsHtml),
};
