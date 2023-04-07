import ReactTable from "./table/ReactTable";
import {useState, useEffect, useContext } from "react";
import { FormattedMessage } from "react-intl";
import ImgButton from "./table/ImgButton";
import { urlContext } from "../web/Root";
// import SearchBar from "./search/SearchBar";
import { TableContext } from "../tab/Violation";

export default function ViolationDemo() {
  const { tableData, setTableData } = useContext(TableContext);
  

  const serverUrl = useContext(urlContext);

  const fetchurl = serverUrl + "lpr/getAllCars";
  // const fetchurl = "http://192.168.195.213:8080/lpr/all";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchurl);
        const data = await response.json();

        for (let i = 0; i < data.length; i++) {
          const eTime0 = data[i]["imagePath"].replace("./", "");
          data[i]["imagePath"] = eTime0;


          //字串分割for 小圖
          //以cam1做切割...要自己補上 /cam1/小圖路徑/
          //ex :  jpg/20230301/cam1/20230301_114756296_1กฮ4398`.jpg
          
          let arr = data[i]["imagePath"].split('/cam1/')

          // console.log("arr[0]="+ arr[0]);  //  jpg/20230301
          // console.log("arr[1]="+ arr[1]);  //  20230301_114756296_1กฮ4398`.jpg

          const small = arr[0]+"/cam1/plate/" + arr[1];
          data[i]["smallimagePath"] = small;

        }
        setTableData(data);
        //setTableData([...tableData,data]);
      } catch (error) {
        console.log("error", error);
      }

      //每10秒重新抓一次資料
      // setInterval(() => {
      //   fetchData();
      //  }, 10000);
    };

    fetchData();
  }, [fetchurl, setTableData]);

  //console.log(tableData);
  

  return (
    <div className="App">
      {/* <SearchBar /> */}
      <ReactTable
        tableData={tableData}
        sizePerPage={sizePerPage}
        tableHeader={TableHeader}
        tableBody={tableBody}
      />
    </div>
  );
}

const sizePerPage = 10;

const TableHeader = () => {
  return (
    <tr>
      <th>
        <FormattedMessage id="visitor-plateNumber" />
      </th>
      <th>
        <FormattedMessage id="visitor-plateNumber-small" />
      </th>

      <th>
        <FormattedMessage id="recognitionTimeStr" />
      </th>
      <th>
        <FormattedMessage id="cameraId" />
      </th>

      <th>
        <FormattedMessage id="table-th7" />
      </th>
    </tr>
  );
};

const tableBody = (value, index) => {

  return (
    <tr key={index}>
      <td>{value.plateNumber}</td>
      <td>
        <img src={value.smallimagePath}></img>
        </td>
      <td>{value.recognitionTimeStr}</td>
      <td>{value.cameraId}</td>
      <td>
        <ImgButton imagePath= {value.imagePath} />
        {/* <ImgButton imagePath= "SLAM_DUNK_2022.jpg" /> */}
      </td>
    </tr>
  );
};
