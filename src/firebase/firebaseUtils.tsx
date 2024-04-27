import {QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";

class User {
	name: string;
	pw: string;
	msg: string;

	constructor(name: string, pw: string, msg: string) {
		this.name = name;
		this.pw = pw;
		this.msg = msg;
	}
	toString() {
		return this.name + ", " + this.pw + ", " + this.msg;
	}
}
// Firestore data converter
export const userConverter = {
	toFirestore: (user: {name: string; pw: string; msg: string}) => {
		return {
			name: user.name,
			state: user.pw,
			country: user.msg,
		};
	},
	fromFirestore: (
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	) => {
		const data = snapshot.data(options);
		return new User(data.name, data.pw, data.msg);
	},
};
