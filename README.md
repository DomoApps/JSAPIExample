This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the command: `yarn create react-app my-app --template git+ssh://git@github.com/DomoApps/advanced.git`

# DomoApps Advanced App Platform Package

Create React App Template optimized for advanced DomoApp usage.
- The manifest and thumbnail are provided in the `public` folder.
- The proxy server is setup with `@domoinc/ryuu-proxy` for local development to your domo instance.
- An upload script has been added to the package.json for easy upload.

Steps to get going:
1) Use the domoapps cli to login to your Domo instance `domo login`
2) Upload your base app to your Domo instance using `yarn upload` or `yarn upload`
3) The project will build, add all assets to the `build` folder, and then upload the assets to Domo
4) The `manifest.json` file in the `build` folder will be modified by the domoapps cli to include an `id` property. You will want to copy this `id` into the manifest in your `public` folder so that it doesn't continue to create a new `id` on each upload
5) If you intend to use AppDB, make sure to also add a `proxyId` to the `manifest.json` file in your `public` folder. See [documentation](https://developer.domo.com/docs/dev-studio/step4#Set%20Up%20Your%20Proxy) for more info.
6) Generate new `components` and `reducers` using the `yarn generate` command (more info below).

## basic cra-template information

- [Getting Started](https://create-react-app.dev/docs/getting-started) – How to create a new app.
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
