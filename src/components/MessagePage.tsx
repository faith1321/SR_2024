import {collection, getDocs} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {
	AnimatePresence,
	MotionValue,
	motion,
	useAnimate,
	useInView,
	useScroll,
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
	const [urls, setURLs] = useState<string[]>([""]);
	const navigate = useNavigate();

	const [scope, animate] = useAnimate();

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
		const textRef = useRef(null);
		const {scrollYProgress} = useScroll({target: textRef});
		const viewRef = useRef(null);
		const isInView = useInView(viewRef, {once: true});
		const y = useParallax(scrollYProgress, 300);

		// let url = "SR_2024/images/Rui Zhe/093318980015.jpg";
		// getImageURL(urlString).then((result) => {
		// 	url = result;
		// });

		return (
			<section ref={viewRef}>
				<div
					style={{
						transform: isInView ? "none" : "translateX(-200px)",
						opacity: isInView ? 1 : 0,
						transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
					}}
					ref={textRef}
					key={urlString}
				>
					<img ref={scope} src={urlString} alt="Cloud Storage" />
				</div>
				{<motion.h2 style={{y}}>{name}</motion.h2>}
			</section>
		);
	}

	const Paragraph = ({data}: {data: string}) => {
		const ref = useRef(null);
		const {scrollYProgress} = useScroll({
			target: ref,
			offset: ["end end", "start start"],
		});

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

	// const reference = useRef(null);
	// const {scrollYProgress} = useScroll({
	// 	target: reference,
	// });
	// const scaleX = useSpring(scrollYProgress, {
	// 	stiffness: 100,
	// 	damping: 30,
	// 	restDelta: 0.001,
	// });

	const getImageURL = async (URLPointer: string) => {
		if (URLPointer) {
			const storage = getStorage();
			const storageRef = ref(storage, URLPointer);

			let url = "";
			url = await getDownloadURL(storageRef);
			return url;
		} else return "";
	};

	useEffect(() => {
		data.map(async (image) => {
			let url = "";
			url = await getImageURL(image);
			if (url === "" || url === null) {
				return;
			} else {
				setURLs((oldArray) => [...oldArray, url]);
			}
		});
	}, [data]);

	// getImageURL(data).then((result) => {
	// 	setURLs(result);
	// 	return;
	// });

	const renderImages = () => {
		console.log("URLs : " + urls);
		return urls.map(
			(image) => image !== "" && <Image urlString={image} key={image} />
		);
	};

	return (
		<AnimatePresence>
			<motion.header
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				exit={{opacity: 0}}
			>
				<Paragraph data={msg} />
				<Paragraph data={msg} />
				{/* <motion.div className="progress" style={{scaleX}} /> */}
				{renderImages()}
			</motion.header>
		</AnimatePresence>
	);
};

export default Message;
