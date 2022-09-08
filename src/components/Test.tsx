import React, { useRef } from "react";
import { read, utils } from "xlsx";

interface ExceProps {
  onFileUploaded: any;
}

function Test(props: ExceProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const radDataFromExcel = (data: any) => {
    const workBookData = read(data);
    let mySheetData: any = {};

    for (let i = 0; i < workBookData.SheetNames.length; i++) {
      const workSheetData = workBookData.Sheets[workBookData.SheetNames[i]];
      let sheetName = workBookData.SheetNames[i];

      const jsonData = utils.sheet_to_json(workSheetData, {
        header: 1,
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
    <div>
      <div ref={fileRef} className="flex  justify-center items-center w-full">
        <label className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer ">
          <div className="flex flex-col justify-center items-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="mb-3 w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 ">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 ">Xlsx (MAX. 800x400px)</p>
          </div>
          <input
            onChange={(event) => handleFile(event)}
            type="file"
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
export default Test;
