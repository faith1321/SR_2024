import {QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";

class User {
	name: string;
	pw: string;
	msg: string[];
	images: string[];
	imgText: string[];

	constructor(
		name: string,
		pw: string,
		msg: string[],
		images: string[],
		imgText: string[]
	) {
		this.name = name;
		this.pw = pw;
		this.msg = msg;
		this.images = images;
		this.imgText = imgText;
	}
	toString() {
		return this.name + ", " + this.pw + ", " + this.msg;
	}
}
// Firestore data converter
export const userConverter = {
	toFirestore: (user: {
		name: string;
		pw: string;
		msg: string[];
		images: string[];
		imgText: string[];
	}) => {
		return {
			name: user.name,
			password: user.pw,
			message: user.msg,
			images: user.images,
			imgText: user.imgText,
		};
	},
	fromFirestore: (
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	) => {
		const data = snapshot.data(options);
		return new User(data.name, data.pw, data.msg, data.images, data.imgText);
	},
};
