import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import { format } from "date-fns";
import TodoItem from '/components/todo/item'

ReactModal.setAppElement("#__next"); // set the app element to the root div

export default function Todo() {
	const [date, setDate] = useState('');
	const [todos, setTodos] = useState({});
	const [editElement, setEditElement] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const dateParam = params.get('date');

    	if (dateParam)
		{
			setDate(dateParam);
			fetch(`/api/data?date=${dateParam}`)
			.then(response => response.json())
			.then(data => {
				if (data) {
					setIsLoading(false);
					setTodos(data.todo);

					const newObject = {};
					for (let key in data.todo) {
						newObject[key] = false; // Replace empty string with the desired value
					}

					setEditElement(newObject);
				}
			})
			.catch(error => console.error(error));
		}
	}, [date]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const todo_id  = (Object.keys(todos).length + 1);
		const todoBody = {
			title: event.target.todo.value,
			done: false
		};
		const res = await postApi(todo_id, todoBody);

		if (res.ok) {
			const newTodo = {
				[todo_id]: {
					title: event.target.todo.value,
					done: false
				}
			};

			setTodos({...todos, ...newTodo});
			setEditElement({...editElement, ...{[todo_id]: false}});
			event.target.todo.value = "";
			closeModal();
		} else {
			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	};

	const handleEdit = (index) => {
		setEditElement(oldEdit => ({ ...oldEdit, [index]: true }));
	}

	const handleUpdate = async (index) => {
		const input = document.getElementById(`update-input-` + index);
		const todoBody = {
			title: input.value,
			done: todos[index].done
		};
		const res = await postApi(index, todoBody);

		if (res.ok) {
			setTodos(oldTodos => {
				const updatedTodo = { ...oldTodos[index], title: input.value };
				return { ...oldTodos, [index]: updatedTodo };
			});
			setEditElement(oldEdit => ({ ...oldEdit, [index]: false }));
		} else {
			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	}

	const handleDelete = async (index) => {
		const res = await deleteApi(index);

		if (res.ok) {
			setTodos(oldTodos => {
				const newTodos = Object.entries(oldTodos).filter(([key, value]) => key !== index);
				return Object.fromEntries(newTodos);
			});
			setEditElement(oldEdit => {
				const updatedEdit = Object.entries(oldEdit).filter(([key, value]) => key !== index);
				return Object.fromEntries(updatedEdit);
			});
		} else {
			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	}

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

  	async function handleCheck(index) {
		setTodos(oldTodos => {
			// create a new object with the existing todo properties, but with the "done" property set to the opposite of its current value
			const updatedTodo = { ...oldTodos[index], done: !oldTodos[index].done };
			return { ...oldTodos, [index]: updatedTodo };
		});

		const todoBody = {
			title: todos[index].title,
			done: !todos[index].done
		};
		const res = await postApi(index, todoBody);

		if (!res.ok) {
			setTodos(oldTodos => {
				// create a new object with the existing todo properties, but with the "done" property set to the opposite of its current value
				const updatedTodo = { ...oldTodos[index], done: !oldTodos[index].done };
				return { ...oldTodos, [index]: updatedTodo };
			});

			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	}

	async function postApi(index, todoBody) {
		const postData = {
			date: date,
			todo_id: index,
			body: todoBody
		};

		const res = await fetch('/api/data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});

		return res;
	}

	async function deleteApi(index) {
		const postData = {
			date: date,
			todo_id: index,
		};

		const res = await fetch('/api/data', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});

		return res;
	}

	if (isLoading)
		return (<>
			<div className="flex justify-center items-center h-screen">
				<div className="relative">
					<div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900"></div>
					<p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-900 z-10">Loading...</p>
				</div>
			</div>
		</>)
	else
		return (
			<>
				<div className="h-screen overflow-y-scroll">
					<div className="bg-gray-800 max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
						<h1 className="text-6xl pb-12">Todo List - {format(new Date(date).getTime(), "dd MMM yyyy")}</h1>
						<form onSubmit={handleSubmit}>
							<input type="text" name="todo" placeholder="Add a todo" className="w-9/12 h-10 text-center mr-8 rounded-xl bg-gray-100 text-black" autoComplete="off" />
							<button type="submit" className="rounded bg-black px-5 py-1">Add</button>
						</form>
					</div>
					{
						(!todos || Object.keys(todos).length == 0) ?
						(
							<div className="text-center pt-10">
								<span className="text-3xl">No task found, please add new todo</span>
							</div>
						) :
						(
							<div>
								<header className="bg-blue-500 text-white py-4 text-center flex justify-between items-center">
									<h1 className="text-2xl font-bold mx-auto">My Header</h1>
									<button onClick={openModal} className="rounded bg-black font-bold mr-8 px-3 py-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
										+
									</button>
								</header>
								<ul>
									{
										Object.entries(todos).map(([idx, value]) => {
											return <TodoItem
													key={idx}
													idx={idx}
													done={value.done}
													title={value.title}
													handleCheck={() => handleCheck(idx)}
													isEdit={editElement[idx]}
													handleEdit={() => handleEdit(idx)}
													handleUpdate={() => handleUpdate(idx)}
													handleDelete={() => handleDelete(idx)}
												/>
										})
									}
								</ul>
							</div>
						)
					}

					<ReactModal isOpen={isModalOpen} onRequestClose={closeModal} className="bg-black bg-opacity-50">
						<div className="modal-content flex justify-center items-center h-screen">
							<div className="w-96 bg-white rounded-lg shadow-lg p-6">
								<h1 className="text-gray-800 text-xl font-bold mb-4">Create new todo</h1>
								<form onSubmit={handleSubmit}>
									<input type="text" name="todo" placeholder="title" className="bg-gray-100 rounded-lg p-2 my-4 w-full text-black" autoComplete="off" />
									<button onClick={closeModal} className="bg-red-500 text-white rounded-lg py-2 px-4 font-bold hover:bg-red-600">
										Close
									</button>
									<button className="bg-blue-500 text-white rounded-lg py-2 px-4 font-bold hover:bg-blue-600 float-right">
										Add
									</button>
								</form>
							</div>
						</div>
					</ReactModal>

				</div>
			</>
		);
}