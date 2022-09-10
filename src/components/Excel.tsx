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
  fetchTasks: ChangeEventHandler<HTMLOptionElement>;
  inputHeader: ChangeEventHandler<HTMLInputElement>;
  serachFilter: MouseEventHandler<HTMLButtonElement>;
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
      <div className="relative mb-2 ">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Headr row"
        />
        <button
          onClick={props.serachFilter}
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
        >
          Choose headr row
        </button>
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
