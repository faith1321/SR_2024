import {collection, getDocs} from "firebase/firestore";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {db} from "../firebase/firebase-config";
import {userConverter} from "../firebase/firebaseUtils";
import "./HomePage.css";
import {loadState} from "./localStorageUtils";

type states = "" | "correct" | "wrong" | null;

const Message = () => {
	const [name, setName] = useState("");
	const [msg, setMsg] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		setName(loadState("name"));
		loadMsg();
	});

	const usersCollectionRef = collection(db, "users").withConverter(
		userConverter
	);

	const loadMsg = async () => {
		const usersData = await getDocs(usersCollectionRef);

		usersData.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
			if (doc.data().name === name) {
				setMsg(doc.data().msg);
			}
		});
	};

	return (
		<div className="flex flex-column gap-5 homepage">
			<header>
				<p className="header-p">{msg}</p>
			</header>
		</div>
	);
};

export default Message;
