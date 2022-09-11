import React, { useState } from "react";
import Excel from "./Excel";
import { utils, writeFile } from "xlsx";
import * as _ from "lodash";
import axios from "axios";

function Home() {
  const [sheetData, setSheetData] = useState<any>(null);
  const [sheet, setSheet] = useState<any>(null);
  const [sheetNames, setSheetNames] = useState<any>("");
  const [sheetName, setSheetName] = useState<string>("mySheetData.xlsx");
  const [row, setrow] = useState<any>([]);
  const [show, setshow] = useState<Boolean>(false);
  const [taskValue, setTaskValue] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<any>("");

  //open modal
  const openModal = () => {
    setshow(!show);
  };

  const inputHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRow(e.target.value);
  };
  const serachFilter = () => {
    console.log(sheetData);
    const indexRow = sheetData[sheet][0].indexOf(parseInt(selectedRow));
    console.log(selectedRow);
    let index = 0;
    sheetData[sheet].map((item: any) => {
      sheetData[sheet].push([item[indexRow]]);
      index += 1;
    });
    sheetData[sheet].splice(0, sheetData[sheet].length - index);
    setSheetData(sheetData);
    console.log(sheetData);
  };

  // get Row
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/row");
    const data = await res.json();

    const test: any = [];

    data.map((item: any) => test.push(Object.keys(item)));

    test.map((item: any) => sheetData[sheet].push(item));

    setSheetData(sheetData);
  };

  const uniqueFile = () => {
    console.log(sheetData);

    for (let index = 0; index < sheetData[sheet].length; index++) {
      const oneRow = sheetData[sheet][index];
      const uniqurow = _.uniq(oneRow);

      sheetData[sheet][index] = uniqurow;
    }
    setSheetData(sheetData);
  };

  // Add Row
  const addTask = async () => {
    const dataSend = {
      header: selectedRow,
      rowv: taskValue,
    };

    setshow(!show);
    const res = await axios.post("http://localhost:5000/row", dataSend);
  };

  const handlefileUploaded = (e: any) => {
    if (e) {
      let sheetNames = Object.keys(e);
      setSheetNames(sheetNames);
      setSheet(sheetNames[0]);
    } else {
      setSheetNames(null);
    }
    setSheetData(e);
    console.log(e);
  };

  const handleSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSheet(e.target.value);
  };

  const handleOnExport = () => {
    const wb = utils.book_new(); // book
    const ws = utils.aoa_to_sheet(sheetData[sheet]); // sheet

    utils.book_append_sheet(wb, ws, "sheetnew"); //
    writeFile(wb, sheetName + ".xlsx");
  };

  return (
    <div className="w-full">
      <Excel
        serachFilter={serachFilter}
        inputHeader={inputHeader}
        uniqueFile={uniqueFile}
        onFileUploaded={(e: any) => handlefileUploaded(e)}
        fetchTasks={fetchTasks}
      />
      {sheetData && (
        <div>
          <div className="flex w-full justify-around items-center mt-8">
            {sheetNames.map((item: any) => (
              <div>
                <input
                  type="radio"
                  checked={item === sheet}
                  onChange={handleSheetChange}
                  name="sheetName"
                  value={item}
                  key={item}
                />
                <label className="ml-2">{item}</label>
              </div>
            ))}
          </div>
          <div className="overflow-scroll  h-screen mx-10 relative">
            <table className=" text-sm border border-gray-400 text-left text-gray-500 ">
              <thead className="text-xs  text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  {sheetData[sheet][0].map((item: string) => (
                    <th scope="col" className="py-3 px-6" key={item}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetData[sheet].map((row: any) => (
                  <tr className="bg-white border-b " key={row}>
                    {row.map((item: string | number | null | undefined) => (
                      <td className="py-4 px-6" key={item}>
                        {item}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <button
          onClick={openModal}
          type="button"
          className="text-white w-60  ml-10 my-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
        >
          Add coustom property
        </button>
        <button
          className="text-white w-60  ml-10 my-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
          onClick={fetchTasks}
        >
          Import
        </button>

        {show ? (
          <div className="w-1/4 ml-10 bg-white shadow-xl relative left-80 p-4 rounded">
            <div className="mb-6">
              <label
                htmlFor="small-input"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Row Value
              </label>
              <input
                onChange={(e: any) => setTaskValue(e.target.value)}
                type="text"
                id="small-input"
                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
            <label
              htmlFor="countries"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Select an type
            </label>
            <select
              onChange={(e) => setType(e.target.value)}
              id="countries"
              className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option selected>Choose a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>
            <button
              onClick={addTask}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Add Task
            </button>
          </div>
        ) : (
          ""
        )}

        <div className="relative ml-10 w-1/2">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSheetName(e.target.value)
            }
            type="search"
            id="search"
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="File name"
          />
          <button
            onClick={handleOnExport}
            type="submit"
            className="text-white z-10 absolute right-2.5 bottom-2.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
