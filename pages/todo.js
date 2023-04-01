import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import { format } from "date-fns";
import TodoItem from '/components/todo/item'
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";

ReactModal.setAppElement("#__next"); // set the app element to the root div

export default function Todo() {
	const [date, setDate] = useState('');
	const [modalCategory, setmodalCategory] = useState('');
	const [todos, setTodos] = useState({});
	const [editElement, setEditElement] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();

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
					Object.entries(data.todo).map(([category, todo]) => {
						newObject[category] = {};
						Object.entries(todo).map(([key, value]) => {
							newObject[category][key] = false
						})
					})

					setEditElement(newObject);
				}
			})
			.catch(error => console.error(error));
		}
	}, []);

	const handleCreateCat = async (event) => {
		event.preventDefault();
		const category = event.target.category.value;
		const res = await postCatApi(category);

		if (res.ok) {
			const newTodo = {
				[category]: {}
			};

			setTodos({...todos, ...newTodo});
			setEditElement({...editElement, ...newTodo});
			event.target.category.value = "";
		} else {
			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const numTodos = Object.keys(todos[modalCategory]).length;
		const todo_id  = (numTodos + 1);
		const data     = {
			title: event.target.todo.value,
			done: false
		};
		
		const newTodo = {
			[todo_id]: {
				title: event.target.todo.value,
				done: false
			}
		};

		const updatedTodo = {
			...todos,
			[modalCategory]: {
			  ...todos[modalCategory],
			  ...newTodo
			}
		};
		
		setTodos(updatedTodo);
		setEditElement({...editElement, ...{[modalCategory]: { [todo_id]: false }}});
		event.target.todo.value = "";
		closeModal();
		
		const res = await postApi(todo_id, modalCategory, data);

		if (!res.ok){
			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	};

	const handleEdit = (index, category) => {
		setEditElement(oldEdit => ({
			...oldEdit,
			[category]: {
			  ...oldEdit[category],
			  [index]: true
			}
		}));
	}

	const handleUpdate = async (index, category) => {
		setEditElement(oldEdit => ({
			...oldEdit,
			[category]: {
			  ...oldEdit[category],
			  [index]: false
			}
		}));
		const input = document.getElementById(`update-input-${category}-` + index);
		const todoBody = {
			title: input.value,
			done: todos[category][index].done
		};

		setTodos(oldTodos => ({
			...oldTodos,
			[category]: {
				...oldTodos[category],
				[index]: {
					title: input.value,
					done: todos[category][index].done
				}
			}
		}));

		setEditElement(oldEdit => ({
			...oldEdit,
			[category]: {
			  ...oldEdit[category],
			  [index]: false
			}
		}));

		const res = await postApi(index, category, todoBody);

		if (!res.ok){
			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	}

	const handleDelete = async (index, category) => {
		// Delete the property with index 1 from category1
		const newTodos = Object.fromEntries(
			Object.entries(todos[category])
				.filter(([key, value]) => key !== index)
				.map(([key, value], index) => [index + 1, value])
		);

		setTodos(oldTodos => {
			return {...oldTodos, [category]: newTodos};
		});

		setEditElement(oldEdit => {
			const updatedEdit = Object.fromEntries(
				Object.entries(oldEdit[category])
					.filter(([key, value]) => key !== index)
					.map(([key, value], index) => [index + 1, value])
			);
			return {...oldEdit, [category]: updatedEdit};
		});

		const res = await deleteApi(category, newTodos);

		if (!res.ok) {
			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	}

	const openModal = (category) => {
		setmodalCategory(category);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setmodalCategory('');
		setIsModalOpen(false);
	};

  	async function handleCheck(index, category) {
		console.log(category);
		console.log(todos[category][index]);
		setTodos(oldTodos => {
			// create a new object with the existing todo properties, but with the "done" property set to the opposite of its current value
			const updatedTodo = { ...oldTodos[category][index], done: !oldTodos[category][index].done };
			return { ...oldTodos,
				[category]: {
					...oldTodos[category],
					[index]: updatedTodo
				}
			};
		});

		const todoBody = {
			title: todos[category][index].title,
			done: !todos[category][index].done
		};
		const res = await postApi(index, category, todoBody);

		if (!res.ok) {
			setTodos(oldTodos => {
				// create a new object with the existing todo properties, but with the "done" property set to the opposite of its current value
				const updatedTodo = { ...oldTodos[category][index], done: !oldTodos[category][index].done };
				return { ...oldTodos,
					[category]: {
						...oldTodos[category],
						[index]: updatedTodo
					}
				};
			});

			const errorResponse = await res.json();
			const errorMessage = errorResponse.message; // Assuming the error message is in a "message" property of the response body
			alert(`Error Code: ${res.status}` + "\n" + errorMessage);
		}
	}

	const handleBackButtonClick = () => {
		router.back();
	};

	async function postApi(index, category, todoBody) {
		const postData = {
			date: date,
			category: category,
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

	async function postCatApi(category) {
		const postData = {
			date: date,
			category: category
		};

		const res = await fetch('/api/category', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});

		return res;
	}

	async function deleteApi(category, body) {
		const postData = {
			date: date,
			category: category,
			body: body
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
						<h1 className="xl:text-6xl max-xl:text-3xl pb-12 text-white">
							<button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-full inline-flex items-center my-1 float-left" onClick={handleBackButtonClick}>
								<FiArrowLeft />
							</button>
							Todo List - {format(new Date(date).getTime(), "dd MMM yyyy")}
						</h1>
						<form onSubmit={handleCreateCat}>
							<input type="text" name="category" placeholder="Add a category" className="w-9/12 max-xl:w-3/5 h-10 text-center mr-8 rounded-xl bg-gray-100 text-black" autoComplete="off" />
							<button type="submit" className="rounded bg-black px-5 py-1 text-white">Add</button>
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
							Object.entries(todos).map(([category, todo], categoryIndex) => {
								const bgHeaderOpacity = (categoryIndex + 3) * 100; // calculate opacity between 10 and 100
								return (
									<div key={categoryIndex} className="pb-5">
										<header className={`bg-indigo-${bgHeaderOpacity} text-white py-4 text-center flex justify-between items-center`}>
											<h1 className="text-2xl font-bold mx-auto">{category}</h1>
											<button onClick={() => openModal(category)} className="rounded bg-black font-bold mr-8 px-3 py-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
												+
											</button>
										</header>
										<ul>
											{Object.entries(todo).map(([idx, value]) => {
												return <TodoItem
														key={idx}
														idx={idx}
														done={value.done}
														title={value.title}
														category={category}
														handleCheck={() => handleCheck(idx, category)}
														isEdit={editElement[category][idx]}
														handleEdit={() => handleEdit(idx, category)}
														handleUpdate={() => handleUpdate(idx, category)}
														handleDelete={() => handleDelete(idx, category)}
													/>
											})}
										</ul>
									</div>
								)
							})
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