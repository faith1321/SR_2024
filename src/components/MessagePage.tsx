import {collection, getDocs} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {
	AnimatePresence,
	motion,
	useAnimate,
	useInView,
	useScroll,
	useSpring,
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

	const [scope, animate] = useAnimate();
	const isInView = useInView(scope);

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

	// function useParallax(value: MotionValue<number>, distance: number) {
	// 	return useTransform(value, [0, 1], [-distance, distance]);
	// }

	function Image({urlString}: {urlString: string}) {
		const ref = useRef(null);
		const {scrollYProgress} = useScroll({target: ref});
		// const y = useParallax(scrollYProgress, 300);

		return (
			<section>
				<div ref={ref}>
					<img ref={scope} src={url} alt="Cloud Storage" />
				</div>
				{/* <motion.h2 style={{y}}>{name}</motion.h2> */}
			</section>
		);
	}

	const Paragraph = ({data}: {data: string}) => {
		const ref = useRef(null);
		const {scrollYProgress} = useScroll({
			target: ref,
			offset: ["end", "start"],
		});
		// const scaleX = useSpring(scrollYProgress);

		return (
			<p className="paragraph">
				<motion.div
					className="paragraph-text"
					style={{scale: scrollYProgress}}
					initial={{opacity: 0, scale: 0}}
					animate={{opacity: 1, scale: [0, 1]}}
					transition={{
						duration: 0.8,
						delay: 0.1,
						ease: [0, 0.71, 0.2, 1.01],
					}}
				>
					{data}
				</motion.div>
			</p>
		);
	};

	useEffect(() => {
		if (isInView) {
			animate(scope.current, {opacity: 1});
		}
	}, [isInView]);

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
		<AnimatePresence>
			<motion.header
				// whileHover={{backgroundColor: "grey"}}
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				exit={{opacity: 0}}
			>
				<Paragraph data={msg} />
				<motion.div className="progress" style={{scaleX}} />
				{data.map((image) => (
					<Image urlString={image} key={image} />
				))}
			</motion.header>
		</AnimatePresence>
	);
};

export default Message;
