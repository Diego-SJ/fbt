import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCefJF9vFFj2nAcOdFGtJufz6hvSDVwWlg',
	authDomain: 'test1-d2593.firebaseapp.com',
	projectId: 'test1-d2593',
	storageBucket: 'test1-d2593.appspot.com',
	messagingSenderId: '840308951902',
	appId: '1:840308951902:web:74d525b6341ef14861ddcf'
};

!firebase.apps.length && firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore().collection('books');

export const loginWIthGOogle = () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	return firebase
		.auth()
		.signInWithPopup(provider)
		.then(({ user }) => ({
			uid: user.uid,
			displayName: user.displayName,
			email: user.email,
			avatar: user.photoURL
		}))
		.catch(() => {
			return null;
		});
};

export const saveBook = async (userId, books) => {
	db.doc(userId).set({ favorites: books });
};

export const updateBookList = async (userId, books) => {
	await db.doc(userId).update({ favorites: books });
};

export const signOut = () => {
	firebase.auth().signOut();
};

export const getAllBooksByUser = async (uid) => {
	return db
		.doc(uid)
		.get()
		.then((snap) => {
			return snap.data().favorites;
		})
		.catch((error) => {
			return [];
		});
};
