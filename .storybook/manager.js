import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  showPanel: false,
  theme: create({
    base: 'light',
    brandTitle: 'Airbnb DS — study storybook (unofficial)',
    colorSecondary: '#ff385c',
    fontBase: 'Inter, system-ui, sans-serif',
  }),
});
