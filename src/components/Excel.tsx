import React, { ChangeEventHandler, useRef, useState } from "react";
import { read, utils } from "xlsx";
interface ExceProps {
  onFileUploaded: Function;
  uniqueFile: ChangeEventHandler<HTMLInputElement>;
  fetchTasks: ChangeEventHandler<HTMLOptionElement>;
}

function Excel(props: ExceProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [blank, setBlank] = useState(false);

  const radDataFromExcel = (data: any) => {
    const workBookData = read(data);
    let mySheetData: any = {};

    for (let i = 0; i < workBookData.SheetNames.length; i++) {
      const workSheetData = workBookData.Sheets[workBookData.SheetNames[i]];
      let sheetName = workBookData.SheetNames[i];

      const jsonData = utils.sheet_to_json(workSheetData, {
        header: 1,
        blankrows: false,
      });
      mySheetData[sheetName] = jsonData;
    }
    return mySheetData;
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const myFile: File = (event.target.files as FileList)[0];
    const data = await myFile.arrayBuffer();
    const mySheetData = radDataFromExcel(data);

    props.onFileUploaded(mySheetData);
  };

  return (
    <div className="mx-10">
      <input
        className="block my-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer  focus:outline-none"
        id="file_input"
        type="file"
        ref={fileRef}
        onChange={(event) => handleFile(event)}
      />
      <div className="flex mb-2">
        <label className="mr-2 text-gray-600">Choose header row:</label>
        <input
          type="text"
          id="small-input"
          className="block p-2  text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 w-[85%]"
        />
      </div>
      {/* <div className="flex mb-2 w-full">
        <label className="mr-2 text-gray-600">Apply configuration:</label>
        <option onChange={props.fetchTasks} value="Hello">
          <select name="Hello" id="">
            Hello
          </select>
        </option>
      </div> */}
      <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex ">
        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
          <div className="flex items-center pl-3">
            <input
              id="vue-checkbox-list"
              type="checkbox"
              onChange={props.uniqueFile}
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 "
            />
            <label className="py-3 ml-2 w-full text-sm font-medium text-gray-900">
              Remove Duplicte
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
          <div className="flex items-center pl-3">
            <input
              id="react-checkbox-list"
              type="checkbox"
              onChange={() => setBlank(true)}
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 "
            />
            <label className="py-3 ml-2 w-full text-sm font-medium text-gray-900 ">
              Remove Blank
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
          <div className="flex items-center pl-3">
            <input
              id="angular-checkbox-list"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500  focus:ring-2"
            />
            <label
              htmlFor="angular-checkbox-list"
              className="py-3 ml-2 w-full text-sm font-medium text-gray-900 "
            >
              Update Data
            </label>
          </div>
        </li>
        <li className="w-full ">
          <div className="flex items-center pl-3">
            <input
              id="laravel-checkbox-list"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 "
            />
            <label
              htmlFor="laravel-checkbox-list"
              className="py-3 ml-2 w-full text-sm font-medium text-gray-900"
            >
              Replace Data
            </label>
          </div>
        </li>
      </ul>
    </div>
  );
}
export default Excel;
