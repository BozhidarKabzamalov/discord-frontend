import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import GlobalStyle from "./globalStyles.js";
import { store } from "./store";
import { Provider } from "react-redux";
import "./i18n";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<GlobalStyle />
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>
);
