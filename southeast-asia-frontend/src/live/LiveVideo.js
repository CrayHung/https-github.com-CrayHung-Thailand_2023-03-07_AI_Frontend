import React, { useEffect, useState ,useRef} from "react";
import ReactHlsPlayer from "react-hls-player";
import MyModal from "./MyModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LiveVideo.css";
import { FormattedMessage, useIntl } from "react-intl";



export default function LiveVideo(){


  /*************************docker hls作法 START****************************** */

const ip_win = window.location.host.split(":")[0];
//console.log("ip_win="+ip_win);
/**啟動docker hls的port位置8081  */
const ip = "http://localhost:8081"
 //const ip = window.location.host.split(":")[0];  //localhost


/**docker啟動rtsp轉換的command */
const rtspUrl = `http://localhost:8081/start`;

/*測試用rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4*/
//const rtspUrl1 = "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4";


/** 現場RTSP URi */  
 const rtspUrl1 = "rtsp://admin:123456@192.168.2.36:554/media/media.amp?streamprofile=Profile1&audio=0";



/**儲存轉換成react-Hls-player可以播放的檔案路徑 */
const [hlsuri1, setHlsUri1] = useState([]);
//const [hlsuri2, setHlsUri2] = useState([]);


/**把現場RTSP URi餵給要POST給docker 的rtsp資料 */
const rtspData1 = {"uri": rtspUrl1,"alias": "camera1"};
//const rtspData2 = {"uri": rtspUrl2,"alias": "camera2"};
/** */
function postRtsp1() {
  fetch(rtspUrl, {
    method: 'POST',
    body: JSON.stringify(rtspData1)
  })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      setHlsUri1(ip+response.uri);
  });
}


/**一開始就丟串流進入docker container */
useEffect(() => {
  postRtsp1();
},[]);

/*************************docker hls作法 END ****************************** */


/*************************websocket作法 START ****************************** */

// var ws = React.useRef(new WebSocket('ws://localhost:8080/ws')).current;

  /**儲存新車牌號碼 , 更新於網頁 */
  const [cam1plate, setCam1plate] = useState('');
  /**儲存照片路徑 */
  const [cam1image, setCam1image] = useState('');
  /**儲存照片日期 */
  const [cam1date, setCam1date] = useState('');

  /**用來儲存wd連線 */
  // const [ws, setWs] = useState(null);
  // const [message, setMessage] = useState('')


/**當前端確實接收到websocket傳來的"update"後 , call此func抓新車牌 */
async function catchPlateNumber(){
  /**連到server取得最新的所有資料 (或只要取車牌資料)  */
  const res = await fetch("http://localhost:8080/lpr/cams/latest");
  const res_tmp = await res.json();

  console.log(res_tmp.cam1);
  const tmp_date = (res_tmp.cam1.recognitionTimeStr).substr(0,10);

  setCam1date(tmp_date);
  setCam1plate(res_tmp.cam1.plateNumber);
  setCam1image(res_tmp.cam1.imagePath);
}


/**websocket 進入點 */
useEffect(()=>{
  catchPlateNumber();
  const wsUrl = "ws://127.0.0.1:8080/ws";
  const ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    //console.log(`connected to ${wsUrl}`);
  };
  ws.onerror = (e) => {
    console.log(e.message);
  };
  ws.onmessage = (msg) => {
    const data = msg.data;
    console.log(data);
    if (data === "update") {
      catchPlateNumber();
    }
  };
},[])

/**websocket 結束點 */



/**當lpr有丟新車號時 , 執行抓新車牌 */
// useEffect(()=>{
//   catchPlateNumber();
// },[plate1])

// useEffect(()=>{
//   catchPlateNumber();
// },[plate1,plate2])

   return (
    <div>
    <div className="grid-item grid-title">
    <FormattedMessage id="menu-live" />
    </div>

     <div className="grid">
      <div className="grid">
        <div className="col">
          <ReactHlsPlayer
            src={hlsuri1}
            autoPlay={true}
            muted={true}
            width={"50%"}
            height={"50%"}
          />
        </div>
      </div>
      {/* <div className="grid-item item2">
        <div className="col">
          <ReactHlsPlayer
            src={hlsuri1}
            autoPlay={true}
            muted={true}
            width={"100%"}
            height={"100%"}
          />
        </div>
      </div> */}
    </div> 

    <div className="grid-item grid-title">
      <FormattedMessage id="visitor-plateNumber" />
    </div>

    <div className="grid-item item2">
        <div
          className="grid-item item1"
          // style={{ width: "100%", height: "100%" }}
        >
          <div>
            <img
              alt=""
              // src={cam1image}
              src="test.jpg"
              width={"50%"}
            ></img>
          </div>
        </div>
        {/* <div className="grid-item item2">
          <div className="col">
            <img
              alt=""
              src={"http://192.168.195.213:8080" + cam1.imagePath}
              src={`http://${ip}:8080${cam2.imagePath}`}
              width={"100%"}
            ></img>
          </div>
        </div> */}
        
      <div>
        <div className="grid-item item1">
          <div className="grid"  style={{color: 'white', backgroundColor: 'lime'}}>{cam1plate}</div>
        </div>
        {/* <div className="grid-item item2">
          <div className="col">{cam2.plateNumber}</div>
        </div> */}
        </div>
      </div>
  </div>
);
 }