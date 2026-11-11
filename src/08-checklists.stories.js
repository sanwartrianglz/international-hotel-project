// Story markup lives in src/sections/<id>.html, behaviour in src/init-checklists.js
import './checklists.css';
import './init-checklists.js';
import { section } from './render.js';
import HouseRulesHtml from './sections/houserules.html?raw';
import ArrivalGuideHtml from './sections/arrival.html?raw';
import HousekeeperChecklistHtml from './sections/hkchecklist.html?raw';

export default { title: 'Checklists' };

export const HouseRules = {
  name: 'House rules & requests',
  render: () => section('houserules', HouseRulesHtml),
};

export const ArrivalGuide = {
  name: 'Arrival guide (check-in steps)',
  render: () => section('arrival', ArrivalGuideHtml),
};

export const HousekeeperChecklist = {
  name: 'Housekeeper room checklist (our concept)',
  render: () => section('hkchecklist', HousekeeperChecklistHtml),
};
