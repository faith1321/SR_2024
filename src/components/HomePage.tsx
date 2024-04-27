import {collection, getDocs} from "firebase/firestore";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {db} from "../firebase/firebase-config";
import {userConverter} from "../firebase/firebaseUtils";
import "./HomePage.css";
import {saveState} from "./localStorageUtils";

type states = "" | "correct" | "wrong" | null;

const HomePage = () => {
	const [name, setName] = useState("");
	const [pw, setPw] = useState("");
	const [userCheck, setUserCheck] = useState<states>(null);
	const [pwCheck, setPwCheck] = useState<states>("");
	const navigate = useNavigate();

	const usersCollectionRef = collection(db, "users").withConverter(
		userConverter
	);

	const handleButtonClick = async () => {
		const usersData = await getDocs(usersCollectionRef);

		usersData.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
			if (name === doc.id) {
				setUserCheck("correct");

				if (pw === doc.data().pw) {
					setPwCheck("correct");
					saveState("name", name);
					navigate("/message");
				} else if (pw === "") {
					setPwCheck("");
				} else {
					setPwCheck("wrong");
				}
			} else if (name === "") {
				setUserCheck("");
			} else {
				setUserCheck("wrong");
			}
		});
	};

	return (
		<div className="flex flex-column gap-5 homepage">
			<header>
				<p className="header-p">Oh, hi there!</p>
			</header>
			<div className="card flex flex-column md:flex-row  text-sm gap-3 homepage-input">
				<div>
					<div className="p-inputgroup flex-1">
						<span className="p-inputgroup-addon">
							<i className="pi pi-user"></i>
						</span>
						<InputText
							id="nameTextField"
							placeholder="Name"
							variant="filled"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					{userCheck === "wrong" && (
						<p className="text-red-400">eh wrong name lah</p>
					)}
					{userCheck === "" && <p className="text-red-400">where your name</p>}
				</div>

				<div>
					<div className="p-inputgroup flex-1">
						<span className="p-inputgroup-addon">
							<i className="pi pi-lock"></i>
						</span>
						<Password
							id="pwTextField"
							placeholder="Password"
							feedback={false}
							toggleMask
							value={pw}
							onChange={(e) => setPw(e.target.value)}
						/>
					</div>
					{pwCheck === "wrong" && (
						<p className="text-red-400">ples check my msg again HAHA</p>
					)}
					{userCheck === "correct" && pwCheck === "" && (
						<p className="text-red-400">not gonna let you in for free bro</p>
					)}
				</div>
			</div>
			<Button
				className="align-self-center homepage-button"
				severity="secondary"
				label="Go!"
				onClick={handleButtonClick}
			/>
		</div>
	);
};

export default HomePage;
