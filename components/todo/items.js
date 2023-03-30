import React, { useState } from "react";
import { format } from "date-fns";
import { useRouter } from 'next/router';

export default function Items({year, month}) {
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
    
    return (
        <>
            {
                (!todos || Object.keys(todos).length == 0) ?
                (
                    <div className="text-center pt-10">
                        <span className="text-3xl">No task found, please add new todo</span>
                    </div>
                ) :
                <ul>
                    {
                        Object.entries(todos).map(([key, value]) => { 
                            return (
                            <li key={key} className="bg-pink-300 m-3 rounded text-black pl-5">
                                <div className="py-4 flex items-center">
                                    <input onChange={() => handleCheck(key)} type="checkbox" checked={value.done} className="mr-3 form-checkbox h-5 w-5 text-pink-500 rounded-md border-gray-300 focus:ring-pink-500 focus:border-pink-500" />
                                    {
                                        !editElement[key] ?
                                            (<p className={`inline-flex font-bold ${value.done ? 'line-through' : ''}`}>{value.title}</p>) :
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
            }
        </>
    );
}

