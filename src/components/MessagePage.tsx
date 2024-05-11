import {collection, getDocs} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {
	MotionValue,
	motion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {db} from "../firebase/firebase-config";
import {userConverter} from "../firebase/firebaseUtils";
import "./HomePage.css";
import "./MessagePage.css";
import {loadState} from "./localStorageUtils";

const Message = () => {
	const [data, setData] = useState<string[]>([""]);
	const [name, setName] = useState("");
	const [msg, setMsg] = useState("");
	const [url, setURL] = useState("");
	const navigate = useNavigate();

	const usersCollectionRef = collection(db, "users").withConverter(
		userConverter
	);

	useEffect(() => {
		setName(loadState("name"));

		const loadData = async () => {
			const usersData = await getDocs(usersCollectionRef).then((result) => {
				result.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					console.log(doc.id, " => ", doc.data());
					if (doc.data().name === name) {
						setData(doc.data().images);
						console.log("data: " + doc.data().images);
						setMsg(doc.data().msg);
					}
				});
			});
		};
		loadData();
	}, [name]);

	function useParallax(value: MotionValue<number>, distance: number) {
		return useTransform(value, [0, 1], [-distance, distance]);
	}

	function Image({urlString}: {urlString: string}) {
		const ref = useRef(null);
		const {scrollYProgress} = useScroll({target: ref});
		const y = useParallax(scrollYProgress, 300);

		return (
			<section>
				<div ref={ref}>
					<img src={url} alt="Cloud Storage" />
				</div>
				{/* <motion.h2 style={{y}}>{name}</motion.h2> */}
			</section>
		);
	}

	const Paragraph = () => {
		const ref = useRef(null);
		const {scrollYProgress} = useScroll({
			target: ref,
			offset: ["end", "start"],
		});
		const scaleX = useSpring(scrollYProgress);

		return (
			<p className="header-p">
				<motion.div style={{scaleX}}>{msg}</motion.div>
			</p>
		);
	};

	const reference = useRef(null);
	const {scrollYProgress} = useScroll({
		target: reference,
	});
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const getImageURL = async () => {
		const storage = getStorage();
		const storageRef = ref(storage, "SR_2024/images/Rui Zhe/093318980015.jpg");

		let url = "";
		url = await getDownloadURL(storageRef);
		return url;
	};

	getImageURL().then((result) => {
		setURL(result);
		return;
	});

	console.log("data: " + data);

	return (
		<header>
			<Paragraph />
			<motion.div className="progress" style={{scaleX}} />
			{data.map((image) => (
				<Image urlString={image} key={image} />
			))}
		</header>
	);
};

export default Message;
