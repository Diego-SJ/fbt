import './App.css';
import {
	getAllBooksByUser,
	loginWIthGOogle,
	saveBook,
	signOut,
	updateBookList
} from './api/firebase';
import { useEffect, useState } from 'react';

function App() {
	const [user, setUser] = useState(null);
	const [titleBook, setTitleBook] = useState('');
	const [authorBook, setAuthorBook] = useState();
	const [isbnBook, setIsbnBook] = useState('');
	const [bookList, setBookList] = useState([]);

	useEffect(() => {
		if (user) {
			getAllBooksByUser(user.uid).then((books) => {
				console.log(books)
				setBookList(books);
			});
		}
	}, [user]);

	const onSigin = async () => {
		const user = await loginWIthGOogle();
		user && setUser(user);
	};

	const onSave = async (e) => {
		e.preventDefault();
		console.log(titleBook, authorBook, isbnBook);

		const booksAux = [...bookList, { title: titleBook, author: authorBook, isbn: isbnBook }];
		setBookList(booksAux);
		await saveBook(user.uid, booksAux);
		setTitleBook('');
		setAuthorBook('');
		setIsbnBook('');
	};

	const onDelete = (index) => {
		const booksAux = bookList.filter((_, idx) => idx !== index);
		setBookList(booksAux);
		updateBookList(user.uid, booksAux);
	};

	const onSignOut = () => {
		signOut();
		setUser(null);
	};

	return (
		<div className="App">
			{user ? (
				<>
					<img src={user.avatar} alt={user.displayName} className="avatar" />
					<h1>{`Bienvenido ${user.displayName}!`}</h1>

					<form className="form" onSubmit={onSave}>
						Title:{' '}
						<input
							type="text"
							onChange={({ target }) => setTitleBook(target.value)}
							value={titleBook}
						/>
						Author:{' '}
						<input
							type="text"
							onChange={({ target }) => setAuthorBook(target.value)}
							value={authorBook}
						/>
						ISB:{' '}
						<input
							type="text"
							onChange={({ target }) => setIsbnBook(target.value)}
							value={isbnBook}
						/>
						<button type="submit">Guardar</button>
						<button type="button" onClick={onSignOut}>
							Sign Out
						</button>
					</form>
					{bookList.length > 0 ? (
						<ul>
							{bookList.map((book, index) => (
								<li onClick={() => onDelete(index)}>
									Title: {book.title} - Author: {book.author} - ISBN: {book.isbn}
								</li>
							))}
						</ul>
					) : (
						<h5>no favorites</h5>
					)}
				</>
			) : (
				<button onClick={onSigin}>Iniciar con Google</button>
			)}
		</div>
	);
}

export default App;
