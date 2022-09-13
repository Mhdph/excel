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
  const [show, setshow] = useState<Boolean>(false);
  const [taskValue, setTaskValue] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [showExcel, setShowExcel] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<any>("");
  const [statusSave, setStatusSave] = useState<any>("");
  const [duplicate, setDuplcate] = useState<boolean>(false);
  const [header, setHeader] = useState<any>("");
  const [indexRow, setIndexRow] = useState<any>("");
  const [blank, setBlank] = useState(false);
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
    setShowExcel(data);
  };

  //merge excel and json

  const mergerUpdate = () => {
    let data: any = [...sheetData[sheet][0]];
    // let allData = structuredClone(sheetData);
    const index = data.indexOf(selectedRow);
    console.log(index);
    data.map((item: any, index: number) => {
      data[index] = "";
    });
    const data2: any = [];
    showExcel.map((item: any) => {
      data2.push(item[indexRow]);
    });
    data2.map((item: any) => {
      data[index] = item;
      console.log(data);
      sheetData[sheet].push(data);
    });
    console.log(sheetData);
    // console.log(allData);
  };

  const mergerReplace = () => {
    let data = sheetData[sheet];
    const index1 = data[0].indexOf(selectedRow);
    data.map((item: any) => {
      item[index1] = "";
    });

    data.map((item: any, index: number) => {
      item[index1] = showExcel[index][indexRow];
    });

    console.log(data);
  };
  //remove uuplicate
  const duplicateChange = () => {
    for (let index = 0; index < sheetData[sheet].length; index++) {
      const oneRow = sheetData[sheet][index];
      const uniqurow = _.uniq(oneRow);

      sheetData[sheet][index] = uniqurow;
    }
    setSheetData(sheetData);
  };

  // remove duplicate
  const uniqueFile = () => {
    setDuplcate(!duplicate);
  };

  // remove blank
  const blacnkRemove = () => {
    setBlank(!blank);
    setShowExcel(showExcel);
  };

  // Add Row
  const addTask = async () => {
    mergerReplace();
    const data1: any = [...showExcel[0]];
    data1[indexRow] = taskValue;
    data1.map((item: any, index: number) => {
      if (item != taskValue) {
        data1[index] = undefined;
      }
    });

    showExcel.push(data1);
    setShowExcel(showExcel);
    console.log(showExcel);
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

  const handleSheetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSheet(e.target.value);
  };

  const handleOnExport = () => {
    if (statusSave == "update") {
      mergerUpdate();
    } else if (statusSave == "replace") {
      mergerReplace();
    } else {
      alert("you dont choose update or replare data");
    }
    duplicate && duplicateChange();
    const wb = utils.book_new(); // book
    const ws = utils.aoa_to_sheet(sheetData[sheet]); // sheet

    utils.book_append_sheet(wb, ws, "sheetnew"); //
    writeFile(wb, sheetName + ".xlsx");
  };

  const updatejson = (e: any) => {
    setStatusSave(e.target.value);
  };

  const showHeaderRow = (e: any) => {
    const value = e.target.value;
    setHeader(value);
    setShowExcel(showExcel);
    const index = showExcel[0].indexOf(value);
    setIndexRow(index);
  };

  return (
    <div className="w-full">
      <Excel
        updatejson={updatejson}
        serachFilter={serachFilter}
        inputHeader={inputHeader}
        uniqueFile={uniqueFile}
        blacnkRemove={blacnkRemove}
        onFileUploaded={(e: any) => handlefileUploaded(e)}
        fetchTasks={fetchTasks}
      />

      {sheetData && (
        <div>
          {sheetNames.map((item: any) => (
            <div>
              <select
                onChange={handleSheetChange}
                id="countries"
                className="block p-4 mx-10 mt-2 pl-10 w-[96%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              >
                <option selected>{item}</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {showExcel && (
        <div>
          <div className="flex w-full justify-around items-center mt-8"></div>
          <div className="overflow-scroll  h-full mx-10 relative">
            <label
              htmlFor="countries"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Select an header
            </label>
            <select
              onChange={showHeaderRow}
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-5 py-2.5 mb-2"
            >
              {showExcel[0].map((item: any) => (
                <option>{item}</option>
              ))}
            </select>
            <table className=" text-sm border border-gray-400 text-left text-gray-500 ">
              <thead className="text-xs  text-gray-700 uppercase bg-gray-50 "></thead>
              <tbody>
                {showExcel.slice(1).map((row: any) => {
                  if (row[indexRow] == undefined && blank) {
                  } else {
                    return (
                      <tr className="bg-white border-b " key={row}>
                        <td className="py-4 px-12">{row[indexRow]}</td>
                      </tr>
                    );
                  }
                })}
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
          <div className="w-1/4 ml-10 bg-white shadow-xl relative left-80 bottom-48 p-4 rounded">
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
              <option selected>Choose a Type</option>
              <option value="Tx">Text</option>
              <option value="in">Integer</option>
              <option value="FR">Float</option>
              <option value="DE">Date</option>
              <option value="DE">DateTime</option>
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
