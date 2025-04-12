import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import GlobalStyle from "./globalStyles.js";
import "./i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient.js";
import { AuthProvider } from "./context/AuthProvider.js";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<GlobalStyle />
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</AuthProvider>
	</BrowserRouter>
);
