import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "store";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
/* eslint-enable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */

// ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
