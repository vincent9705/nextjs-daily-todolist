import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Todo() {
	const [todos, setTodos] = useState({});
	const [editElement, setEditElement] = useState({});
	const [isChecked, setIsChecked] = useState({});
	const [data, setData] = useState(null);
	const date = "2023-03-27";

	useEffect(() => {
		fetch('/api/data?date=2023-03-27')
		.then(response => response.json())
		.then(data => {
			setData(data);
			if (data) {
				setTodos(data.todo);

				const newObject = {};
				for (let key in data.todo) {
					newObject[key] = false; // Replace empty string with the desired value
				}

				setEditElement(newObject);
			}
		})
		.catch(error => console.error(error));
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const todoBody = {
			title: event.target.todo.value,
			done: false
		};
		const res = await postApi(index, todoBody);

		if (res.ok) {
			const newTodo = {
				[postData.todo_id]: {
					title: event.target.todo.value,
					done: false
				}
			};

			setTodos({...todos, ...newTodo});
			setEditElement([...editElement, false]);
			event.target.todo.value = "";
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

  	function handleCheck(index) {
		setTodos(oldTodos => {
			// create a new object with the existing todo properties, but with the "done" property set to the opposite of its current value
			const updatedTodo = { ...oldTodos[index], done: !oldTodos[index].done };
			return { ...oldTodos, [index]: updatedTodo };
		});
	}

	async function postApi(index, todoBody) {
		// todo: check here
		const postData = {
			date: "2023-03-27",
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

	return (
		<>
			<div>
				<div className="bg-gray-800 max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-7xl pb-12">My Todo List</h1>
					<form onSubmit={handleSubmit}>
						<input type="text" name="todo" placeholder="Add a todo" className="w-9/12 h-10 text-center mr-8 rounded-xl bg-gray-100 text-black" autoComplete="off" />
						<button type="submit" className="rounded bg-black px-5 py-1">Add</button>
					</form>
				</div>
				<ul>
					{Object.entries(todos).map(([key, value]) => { 
						return (
						<li key={key} className="bg-pink-300 m-3 rounded text-black pl-5">
							<div className="py-4 flex items-center">
								<input onChange={() => handleCheck(key)} type="checkbox" checked={value.done} className="mr-3 form-checkbox h-5 w-5 text-pink-500 rounded-md border-gray-300 focus:ring-pink-500 focus:border-pink-500" />
								{
									!editElement[key] ?
										(<p className="inline-flex font-bold">{value.title}</p>) :
										(<input id={`update-input-` + key} className="inline-flex bg-pink-200 rounded pl-3" defaultValue={value.title}></input>)
								}
								<div className="ml-auto mr-4">
									{
										!editElement[key] ?
											(<a href="#" onClick={() => handleEdit(key)}>
												<FontAwesomeIcon icon={['fas', 'edit']} />
											</a>)
											:
											(<a href="#" onClick={() => handleUpdate(key)}>
												<FontAwesomeIcon icon={['fas', 'check-circle']} />
											</a>)
									}
									<a href="#" className="ml-3" onClick={() => handleDelete(key)}>
										<FontAwesomeIcon icon={['fas', 'trash']} />
									</a>
								</div>
							</div>
						</li>
					)} )}
				</ul>
			</div>
		</>
	);
}