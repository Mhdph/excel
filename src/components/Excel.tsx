import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useRef,
  useState,
} from "react";
import { read, utils } from "xlsx";
interface ExceProps {
  onFileUploaded: Function;
  uniqueFile: ChangeEventHandler<HTMLInputElement>;
  blacnkRemove: ChangeEventHandler<HTMLInputElement>;
  fetchTasks: ChangeEventHandler<HTMLOptionElement>;
  inputHeader: ChangeEventHandler<HTMLInputElement>;
  serachFilter: MouseEventHandler<HTMLButtonElement>;
  updatejson: MouseEventHandler<HTMLInputElement>;
}

function Excel(props: ExceProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const radDataFromExcel = (data: any) => {
    const workBookData = read(data);
    let mySheetData: any = {};

    for (let i = 0; i < workBookData.SheetNames.length; i++) {
      const workSheetData = workBookData.Sheets[workBookData.SheetNames[i]];
      let sheetName = workBookData.SheetNames[i];

      const jsonData = utils.sheet_to_json(workSheetData, {
        header: 1,
        blankrows: true,
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
      <div className="relative mb-2 ">
        <input
          type="search"
          onChange={props.inputHeader}
          id="default-search"
          className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Headr row"
        />
      </div>

      <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex ">
        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
          <div className="flex items-center pl-3">
            <input
              id="vue-checkbox-list"
              type="checkbox"
              onChange={props.uniqueFile}
              value="duplicate"
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
              onChange={props.blacnkRemove}
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 "
            />
            <label className="py-3 ml-2 w-full text-sm font-medium text-gray-900 ">
              Remove Blank
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
          <div className="flex items-center ml-2">
            <input
              onClick={props.updatejson}
              id="default-radio-1"
              type="radio"
              value="replace"
              name="default-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
            />
            <label
              htmlFor="default-radio-1"
              className="ml-2 text-sm font-medium text-gray-900 "
            >
              Replace data
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
          <div className="flex ml-2 items-center">
            <input
              onClick={props.updatejson}
              id="default-radio-2"
              type="radio"
              value="update"
              name="default-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
            />
            <label
              htmlFor="default-radio-2"
              className="ml-2 text-sm font-medium text-gray-900 "
            >
              Update data
            </label>
          </div>
        </li>
      </ul>
    </div>
  );
}
export default Excel;
