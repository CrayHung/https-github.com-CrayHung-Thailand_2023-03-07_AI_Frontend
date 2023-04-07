import React, { useState, useEffect } from 'react';
import Papa from "papaparse";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/js/src/modal'
// import CsvDownloadButton from 'react-json-to-csv';





export default function Label() {
  //存所有的.csv資料
  const [data, setData] = useState([]);
  //存剛import的.csv檔名
  const [csvName, setCsvName] = useState(null);
  //存剛import的.csv
  // const[newData , setNewData] = useState([null]);

  //所有分頁數
  const [totalPage,setTotalPage] = useState(0);
  //目前所在分頁
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState([]);
   



  // const merge=()=>{

  //   let mergeData = [...newData,...data];
  //   console.log(mergeData);
  //   setData(mergeData);
  // }

  //csv->json
  function importCsv(e) {
    //merge();
    const csvFile = e.target.files[0];
    //console.log(csvFile);
    const csvName = csvFile.name;
    console.log(csvName);
    setCsvName(csvName);  

    Papa.parse(e.target.files[0], {
      header: true,
      download: true,
      delimiter: ",",
      dynamicTyping: true,
      complete: results => {
        setData(results.data);

      }
    });
  
  // let mergeData = [...data,...newData]
  // setData(mergeData);

  }




//  使用pspsparser會使存下來的.csv內容亂碼
  const handleOnSubmit = () => {
    //json->csv
    const csvData = Papa.unparse(data);

    const saveDataAsFile = (csvName, data) => {
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const csvUrl = URL.createObjectURL(blob);
      link.setAttribute('href', csvUrl);
      // link.setAttribute('download', `${csvName}.csv`);
      link.setAttribute('download', `${csvName}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    saveDataAsFile(csvName, csvData);
};




  //分頁用, 每頁資料10筆
  useEffect(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    const allPage = Math.floor(data.length/10);
    setTotalPage(allPage);
    setPageData(data.slice(start, end));
  }, [page, data]);


  //當文字內容改變時,pageData和Data要同時儲存
  const handleChange = (e, index) => {
    const updatedItems = [...pageData]
    //const updatedItems = [...newData]
    // const updatedItems = [...data]
    updatedItems[index].words=e.target.value
    console.log(updatedItems);
    console.log(index);
    setPageData(updatedItems);

  };

  //動態產生<option value>
  const pageOption = [];
  for(let i=1;i<=totalPage;i++){
    pageOption.push(<option value={i}>{i}</option>)
  }


  //deleteItem
  const deleteItem =(e,index)=>{
    const i = index + (page-1)*10;


    const originItems = [...data];

    originItems.splice(i,1);
    setData(originItems);



  }


  

  return (
    <div>
      <input type="file" onChange={importCsv} />
      <table>
        <thead>
          <tr>
            <th>filename</th>
            <th>words</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* {data.map((value,index) => ( */}
          {pageData.map((value,index) => (
            <tr key={index}>
              <td><img   src={`./images_for_label/${value.filename}` }/></td>
              <td><img  style={{ width: "100%", height: "100%" }} src={`./images_for_label/${value.filename}` }/></td>
              <td><img  style={{ width: 200, height: 100 }}  src={`./images_for_label/${value.filename}` }/></td>

              <td>
                <input type="text" value={value.words} defaultValue={value.words} onChange={(e) => handleChange(e, index)} />
              </td>
              <td><button onClick={(e)=>deleteItem(e,index)}>delete</button></td>
            </tr>
          ))}
          <td>
            {/* <CsvDownloadButton data={data} filename={`${csvName}`}> save </CsvDownloadButton> */}
            <button onClick={handleOnSubmit}>save</button>
          </td>
        </tbody>
      </table>

      <div>
        Page:
        <select value={page} onChange={(e) => setPage(Number(e.target.value))}>
          {pageOption}
        </select>
      </div>

    </div>
  );
}