import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import GlobalStyle from "./globalStyles.js";
import "./i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient.js";
import { ThemeProvider } from "styled-components";
import theme from "./theme.js";

createRoot(document.getElementById("root")!).render(
	<ThemeProvider theme={theme}>
		<BrowserRouter>
			<GlobalStyle />
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</ThemeProvider>
);
