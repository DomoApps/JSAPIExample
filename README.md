# Domo Embed Frames Example

This project demonstrates how to create a custom application that embeds Domo cards and utilizes postMessage communication between your custom frames and Domo's embedded analytics.

## 🎯 Purpose

This instructional example teaches developers how to:
- Embed Domo cards in custom applications
- Implement bidirectional communication using postMessage API
- Handle different types of messages and events
- Create a robust communication framework for embedded analytics

## 🚀 Features

### 1. **Embedded Card Component**
- Configurable card embedding with custom dimensions
- Automatic iframe setup with security considerations
- Real-time card configuration updates

### 2. **PostMessage Communication**
- Send messages to embedded cards (filters, refresh commands, custom events)
- Receive messages from embedded cards (user interactions, data updates)
- Real-time message logging and debugging

### 3. **Interactive Controls**
- Apply filters to embedded cards
- Trigger data refreshes
- Export data functionality
- Send custom events and commands

### 4. **Message Logger**
- Real-time logging of all postMessage communications
- Message type categorization (sent/received/system)
- Timestamped message history
- JSON data formatting and display

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Yarn package manager
- Domo Developer Account
- Access to Domo instance with embedding enabled

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd embed-frames-example
   yarn install
   ```

2. **Configure Domo CLI:**
   ```bash
   domo login
   ```

3. **Update configuration:**
   - Edit `src/components/embedded-card/index.tsx`
   - Replace `your-domo-instance` with your actual Domo instance name
   - Update the `domoInstance` prop in the EmbeddedCard component

4. **Run the development server:**
   ```bash
   yarn start
   ```

5. **Upload to Domo (optional):**
   ```bash
   yarn upload
   ```

## 📖 Usage Guide

### Basic Usage

1. **Enter a Card ID**: Input a valid Domo card ID in the configuration section
2. **Configure the card**: Set title and display options
3. **View the embedded card**: The card will load in an iframe
4. **Test communication**: Use the control buttons to send messages

### PostMessage API Examples

#### Sending Messages to Cards
```javascript
// Filter application
iframe.contentWindow.postMessage({
  type: 'FILTER_CHANGE',
  data: { filters: { region: 'North America' } }
}, '*');

// Data refresh
iframe.contentWindow.postMessage({
  type: 'REFRESH_DATA'
}, '*');

// Custom events
iframe.contentWindow.postMessage({
  type: 'CUSTOM_EVENT',
  data: { action: 'highlight', value: 'top-performers' }
}, '*');
```

#### Receiving Messages from Cards
```javascript
window.addEventListener('message', (event) => {
  // Validate origin for security
  if (event.origin !== 'https://your-domo-instance.domo.com') return;
  
  switch (event.data.type) {
    case 'CARD_CLICKED':
      console.log('User clicked on card:', event.data);
      break;
    case 'DATA_UPDATED':
      console.log('Card data updated:', event.data);
      break;
    case 'FILTER_APPLIED':
      console.log('Filter was applied:', event.data);
      break;
  }
});
```

## 🏗 Architecture

### Component Structure
```
src/
├── components/
│   ├── app/                    # Main application component
│   ├── embedded-card/          # Card embedding component
│   ├── message-logger/         # PostMessage logging component
│   └── counter/               # Example counter (can be removed)
├── reducers/                  # Redux state management
└── styles/                    # Global styles
```

### Key Components

#### `EmbeddedCard`
- Manages iframe lifecycle
- Handles card initialization
- Provides security sandbox settings
- Sends initial configuration messages

#### `MessageLogger`
- Logs all postMessage communications
- Provides real-time debugging capabilities
- Formats and displays message data
- Maintains message history

#### `App`
- Main application orchestrator
- Manages global message listeners
- Provides UI for card configuration
- Demonstrates various communication patterns

## 🔒 Security Considerations

### Origin Validation
```javascript
// Always validate message origins in production
if (event.origin !== 'https://your-domo-instance.domo.com') return;
```

### Iframe Sandbox
```html
<iframe
  sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
  src={embedUrl}
/>
```

### Content Security Policy
Configure CSP headers to allow embedding from trusted Domo domains.

## 📋 Message Types Reference

### Standard Messages (sent to cards)
- `FILTER_CHANGE`: Apply filters to card data
- `REFRESH_DATA`: Trigger data refresh
- `EXPORT_DATA`: Request data export
- `CARD_INIT`: Initial card configuration
- `CUSTOM_EVENT`: Custom application events

### Standard Messages (received from cards)
- `CARD_LOADED`: Card finished loading
- `CARD_CLICKED`: User interaction with card
- `DATA_UPDATED`: Data source updated
- `FILTER_APPLIED`: Filter successfully applied
- `ERROR`: Error occurred in card

## 🔧 Customization

### Adding New Message Types
1. Update the message type constants
2. Add handlers in the main App component
3. Update the embedded card component if needed
4. Add corresponding UI controls

### Styling Customization
- Modify SCSS files in each component directory
- Update global styles in `src/styles/`
- Customize color scheme in `src/styles/variables.scss`

## 🐛 Troubleshooting

### Common Issues

1. **Card not loading**
   - Verify card ID is correct
   - Check Domo instance URL
   - Ensure embedding is enabled for the card

2. **Messages not being received**
   - Verify origin validation settings
   - Check browser console for errors
   - Ensure postMessage syntax is correct

3. **CORS errors**
   - Configure proper CORS headers on Domo instance
   - Verify iframe sandbox permissions

## 📚 Additional Resources

- [Domo Embedding Documentation](https://developer.domo.com/docs/embedding/embedded-analytics)
- [PostMessage API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Advanced App Platform Guide](https://developer.domo.com/docs/dev-studio/advanced-app-platform)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
- [User Guide](https://create-react-app.dev) – How to develop apps bootstrapped with Create React App.

## Available Scripts

In the project directory, you can run:

### `yarn generate`

Allows you to generate components or reducers.<br />

**Components**<br />

The command `yarn generate component` will generate a new component and add it to the components folder of your project. There are 3 parameters to the `component` generator that you will be prompted for if you do not provide them inline:
<ol>
  <li> Component Name </li>
  <li> Whether or not you would like to include a test file (y/n) </li>
  <li> Whether or not you would like to include a storybook file (y/n)  </li>
</ol>

You can provide these parameters inline if you want: `yarn generate component myComponent y n` or in part `yarn generate component myComponent`. Any parameter that you do not provide will cause the plop generator to prompt you for an answer.<br />

**Reducers**<br />

The reducer generator only has one parameter, its name. You can generate a reducer using the command `yarn generate reducer myReducer`. If you do not provide a name you will be prompted for one. Generating a reducer will produce the following modifications to your project: <br />

<ol>
  <li> A new folder will be created in the actions directory of your project and an index.ts file will be added to it with some boiler plate examples of creating actions using Redux Toolkit.</li>
  <li> A new folder will be created in the reducers directory of your project and an index.ts file will be added to it with a basic reducer wired up with a default case. Handle new cases by adding `.addCase()` to the builder object provided. More info can be found in the Redux Toolkit <a href='https://redux-toolkit.js.org/api/createReducer#builderaddcase' target="_blank">documentation</a>.</li>
  <li> The index.ts file in the base of the reducer folder will be modified to import your new reducer and wire it up. As long as you always create reducers using the generator command, you should never need to touch this file. </li>
</ol>

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn storybook`

Starts up a storybook server to host any components that have been generated with a storybook file.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
