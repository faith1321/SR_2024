import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {useState} from "react";

const HomePage = () => {
	const [value, setValue] = useState("");
	return (
		<div className="flex flex-column gap-5">
			<header>
				<p>Hi</p>
			</header>
			<InputText
				className=""
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			<Button className="align-self-center" label="Hi" />
		</div>
	);
};

export default HomePage;
