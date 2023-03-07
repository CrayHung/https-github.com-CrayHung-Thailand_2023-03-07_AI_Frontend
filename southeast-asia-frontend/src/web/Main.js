import "./css/main.css";
import Lpr from "../tab/Lpr";
import Violation from "../tab/Violation";
import Live from "../tab/Live";

import ThaiPlate from "../tab/ThaiPlate";
import ParkingRecord from "../tab/ParkingRecord";


import {
  Routes,
  Route
} from "react-router-dom";
import UserProfile from "../tab/UserProfile";
import Thailand from "../tab/Thailand";

export function Main() {
  return (
    <div className="main">
      <div className="main-content">
        <Routes>
          <Route path="/violation" element={<Violation />} />

          <Route path="/" element={<Live />} />

        </Routes>
      </div>
    </div>
  );
}