import React, { useState } from "react";
import Test from "./Test";

function Home() {
  const [sheetData, setSheetData] = useState<any>(null);
  const [sheet, setSheet] = useState<any>(null);
  const [sheetNames, setSheetNames] = useState<any>("");
  console.log(sheetNames);
  console.log(sheetData);
  const handlefileUploaded = (e: any) => {
    if (e) {
      let sheetNames2 = Object.keys(e);
      setSheetNames(sheetNames2);
      setSheet(sheetNames2[0]);
    } else {
      setSheetNames(null);
    }
    setSheetData(e);
  };

  const handleSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSheet(e.target.value);
  };

  return (
    <div>
      <Test onFileUploaded={(e: any) => handlefileUploaded(e)} />

      {sheetData && (
        <div>
          <div className="flex  justify-around items-center my-8">
            {sheetNames.map((item: any) => (
              <div>
                <input
                  type="radio"
                  // checked={item === sheet}
                  onChange={handleSheetChange}
                  name="sheetName"
                  value={item}
                  key={item}
                />
                <label className="ml-2">{item}</label>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto mx-10 relative">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
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
    </div>
  );
}

export default Home;
