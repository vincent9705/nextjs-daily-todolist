import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TodoItem({idx, done, title, handleCheck, isEdit, handleEdit, handleUpdate, handleDelete}) {
    return (
        <li key={idx} className="bg-pink-300 m-3 rounded text-black pl-5">
            <div className="py-4 flex items-center">
                <input onChange={() => handleCheck(idx)} type="checkbox" checked={done} className="mr-3 form-checkbox h-5 w-5 text-pink-500 rounded-md border-gray-300 focus:ring-pink-500 focus:border-pink-500" />
                {
                    !isEdit ?
                        (<p className={`inline-flex font-bold ${done ? 'line-through' : ''}`}>{title}</p>) :
                        (<input id={`update-input-` + idx} className="inline-flex bg-pink-200 rounded pl-3" defaultValue={title}></input>)
                }
                <div className="ml-auto mr-4">
                    {
                        !isEdit ?
                            (<a href="#" onClick={() => handleEdit(idx)}>
                                <FontAwesomeIcon icon={['fas', 'edit']} />
                            </a>)
                            :
                            (<a href="#" onClick={() => handleUpdate(idx)}>
                                <FontAwesomeIcon icon={['fas', 'check-circle']} />
                            </a>)
                    }
                    <a href="#" className="ml-3" onClick={() => handleDelete(idx)}>
                        <FontAwesomeIcon icon={['fas', 'trash']} />
                    </a>
                </div>
            </div>
        </li>
    );
}

