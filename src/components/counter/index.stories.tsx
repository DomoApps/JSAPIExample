import React from 'react';
import { Story, Meta } from '@storybook/react';
import { store } from 'reducers';
import { Counter } from '.';
import { Provider } from 'react-redux';

export default {
  title: 'Counter',
  component: Counter,
} as Meta;

// EXAMPLE:
// const Template: Story<ButtonProps> = (args) => <Button {...args} />;

// export const Primary = Template.bind({});
// Primary.args = {
//   primary: true,
//   label: 'Button',
// };

const Template: Story = () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};
