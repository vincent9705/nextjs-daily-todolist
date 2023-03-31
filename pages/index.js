import React, {useState} from "react";
import Card from "/components/calendar/card";
import { format, addMonths } from "date-fns";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function Home() {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    function handleNextMonth() {
        setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
    }

    function handlePreviousMonth() {
        setCurrentMonth((prevMonth) => addMonths(prevMonth, -1));
    }

  return (
	<>
        <div className="container mx-auto mt-10 max-h-[90vh]">
            <div className="wrapper bg-[#1f2937] rounded shadow w-full">
                <div className="header flex justify-between border-b p-2">
                    <span className="text-lg font-bold pl-3">
                    {format(currentMonth, "yyyy MMM")}
                    </span>
                    <div className="buttons">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full inline-flex items-center mx-2" onClick={handlePreviousMonth}>
                            <span className="hidden sm:block">Previous</span>
                            <span className="block sm:hidden">
                                <FaArrowLeft />
                            </span>
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full inline-flex items-center mx-2" onClick={handleNextMonth}>
                            <span className="hidden sm:block">Next</span>
                            <span className="block sm:hidden">
                                <FaArrowRight />
                            </span>
                        </button>
                    </div>
                </div>
                <Card month={format(currentMonth, "M")} year={format(currentMonth, "yyyy")}/>
            </div>
        </div>
	</>
  );
}