import {PrimeReactProvider} from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";
import HomePage from "./features/HomePage";
import "/node_modules/primeflex/primeflex.css";

function App() {
	return (
		<PrimeReactProvider>
			<div className="App">
				<header className="App-header">
					{/* <img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a> */}
					<HomePage />
				</header>
			</div>
		</PrimeReactProvider>
	);
}

export default App;
