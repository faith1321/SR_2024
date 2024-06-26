import {collection, getDocs} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {
	AnimatePresence,
	MotionValue,
	Variants,
	motion,
	useAnimate,
	useInView,
	useScroll,
	useTransform,
} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import NameSVG from "../assets/svgs/NameSVG";
import {db} from "../firebase/firebase-config";
import {userConverter} from "../firebase/firebaseUtils";
import "./HomePage.css";
import "./MessagePage.css";
import {loadState} from "./localStorageUtils";

const Message = () => {
	interface ImageData {
		url: string;
		index: number;
	}

	const [image, setImage] = useState<string[]>([""]);
	const [name, setName] = useState("");
	const [imgText, setImgText] = useState<string[]>([""]);
	const [msg, setMsg] = useState<string[]>([""]);
	const [imageData, setImageData] = useState<ImageData[]>([]);
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
					if (doc.data().name === name) {
						setImage(doc.data().images);
						setImgText(doc.data().imgText);
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

	function Image({urlString, index}: {urlString: string; index: number}) {
		const textRef = useRef(null);
		const {scrollYProgress} = useScroll({target: textRef});
		const viewRef = useRef(null);
		const isInView = useInView(viewRef, {once: true});
		const y = useParallax(scrollYProgress, 600);

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
				{<motion.h2 style={{y}}>{imgText[index]}</motion.h2>}
			</section>
		);
	}

	const variants: Variants = {
		initial: {opacity: 0, scale: 0},
		onScreen: {
			opacity: 1,
			scale: [0, 1],
			transition: {
				duration: 0.8,
				delay: 0.1,
				ease: [0, 0.71, 0.2, 1.01],
			},
		},
	};

	const Paragraph = ({data}: {data: string}) => {
		const ref = useRef(null);
		const {scrollYProgress} = useScroll({
			target: ref,
			offset: ["end end", "start start"],
		});

		return (
			<section>
				{/* <div ref={ref} style={{overflow: "scroll"}}> */}
				<motion.div
					className="paragraph-text"
					style={{overflow: "scroll"}}
					initial="initial"
					whileInView="onScreen"
					viewport={{once: true, amount: 0.8}}
					variants={variants}
				>
					<p className="paragraph">{data}</p>
				</motion.div>
				{/* </div> */}
			</section>
		);
	};

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
		image.map(async (image, index) => {
			let url = "";
			url = await getImageURL(image);
			if (url === "" || url === null) {
				return;
			} else {
				if (imageData !== undefined)
					setImageData((oldArray) => [...oldArray, {url, index}]);
			}
		});
	}, [image]);

	const renderParagraphs = () => {
		return msg.map((text, index) =>
			index + 1 == msg.length ? null : <Paragraph data={text} key={index} />
		);
	};

	const renderImages = () => {
		return imageData?.map(
			(image) =>
				image.url !== "" && (
					<Image urlString={image.url} key={image.index} index={image.index} />
				)
		);
	};

	const renderEnding = () => {
		const index = msg.length - 1;
		return (
			<>
				<Paragraph data={msg[index]} key={index} />
				<div style={{width: "28%", height: "20%", marginLeft: "auto"}}>
					<p className="ending-text">Cheers,</p>
					<NameSVG width="100%" height="10%" viewBox="0 0 1200 640" />
					<p className="ending-text">June 2024.</p>
					<h1></h1>
				</div>
			</>
		);
	};

	return (
		<AnimatePresence>
			<motion.header
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				exit={{opacity: 0}}
			>
				{renderParagraphs()}
				{/* <motion.div className="progress" style={{scaleX}} /> */}
				{renderImages()}
				{renderEnding()}
			</motion.header>
		</AnimatePresence>
	);
};

export default Message;
