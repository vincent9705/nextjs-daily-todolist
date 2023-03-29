import React, { useState } from "react";
import { format } from "date-fns";
import { useRouter } from 'next/router';

export default function Card({year, month}) {
    const router = useRouter();

    function generateCalendarData(month, year) {
        month = month - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfWeek = new Date(year, month, 1).getDay();
        const lastDayOfWeek = new Date(year, month, daysInMonth).getDay();

        const data = [];
        let row = [];

        // add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            row.push(null);
        }

        // add the days of the month to the calendar grid
        for (let i = 1; i <= daysInMonth; i++) {
            row.push(i);

            // start a new row after adding the last day of the week
            if (row.length === 7) {
                data.push(row);
                row = [];
            }
        }

        // add empty cells for days after the last day of the month
        for (let i = lastDayOfWeek + 1; i < 7; i++) {
            row.push(null);
        }

        // add the last row to the calendar data
        data.push(row);

        return data;
    }

    const calendarData = generateCalendarData(month, year);
    const today        = new Date();
    const daysOfWeek = [
        {long: "Sunday", short: 'Sun'},
        {long: "Monday", short: 'Mon'},
        {long: "Tuesday", short: 'Tue'},
        {long: "Wednesday", short: 'Wed'},
        {long: "Thursday", short: 'Thu'},
        {long: "Friday", short: 'Fri'},
        {long: "Saturday", short: 'Sat'}
    ];

    function handleClick(day) {
        console.log(year, month, day);
        console.log(format(new Date(`${year}-${month}-${day}`).getTime(), "yyyy-MM-dd"))
    }

    const handleRedirect = (day) => {
        const date = format(new Date(`${year}-${month}-${day}`).getTime(), "yyyy-MM-dd");
        router.push({
          pathname: '/todo',
          query: { date: date },
        });
      };
    

    return (
        <>
            <table className="w-full">
                <thead>
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th key={day.short} className="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
                                <span className="xl:block lg:block md:block sm:block hidden">{day.long}</span>
                                <span className="xl:hidden lg:hidden md:hidden sm:hidden block">{day.short}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>


                    {calendarData.map((row, i) => (
                        <tr key={i} className="text-center h-20">
                            {row.map((day, j) => {
                                let color      = day != null ? "" : "bg-gray-500";
                                let is_today   = (format(today, "yyyy") == year && format(today, "M") == month && format(today, "d") == day) ? true : false;
                                let text_color = is_today ? "text-white" : "text-gray-400";
                                color          = is_today ? "bg-blue-400" : color;
                                
                                return (
                                    <td key={j} className={`border p-1 xl:h-40 lg:h-30 md:h-30 sm:h-20 xs:h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-500 ${color}`} day={day}onClick={() => handleRedirect(day)}>
                                        <div className="flex flex-col xl:h-40 lg:h-30 md:h-30 sm:h-20 xs:h-10 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 mx-auto overflow-hidden">
                                            <div className="top h-5 w-full">
                                                <span className={`${text_color}`}>{day}</span>
                                            </div>
                                            <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

