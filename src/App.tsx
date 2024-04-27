import "primeicons/primeicons.css";
import {PrimeReactProvider} from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import Message from "./components/MessagePage";
import "/node_modules/primeflex/primeflex.css";

function App() {
	return (
		<PrimeReactProvider>
			<div className="App">
				<header className="App-header">
					<BrowserRouter>
						<Routes>
							<Route path="/SR_2024" element={<HomePage />} />
							<Route path="/message" element={<Message />} />
						</Routes>
					</BrowserRouter>
				</header>
			</div>
		</PrimeReactProvider>
	);
}

export default App;
