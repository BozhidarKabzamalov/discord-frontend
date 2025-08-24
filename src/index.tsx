import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import "./i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient.js";
import ThemeProvider from "./components/ThemeProvider.js";

createRoot(document.getElementById("root")!).render(
	<ThemeProvider>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</ThemeProvider>
);
