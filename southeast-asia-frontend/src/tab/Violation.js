import { HelmetProvider, Helmet } from "react-helmet-async";
import ViolationDemo from "../violation/ViolationDemo";
import { FormattedMessage, useIntl } from "react-intl";
import React, { createContext, useState } from "react";

export const TableContext = createContext();

function TableProvider({ children }) {
  const [tableData, setTableData] = useState([]);

  return (
    <TableContext.Provider value={{ tableData, setTableData }}>
      {children}
    </TableContext.Provider>
  );
}

export default function Violation() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{useIntl().formatMessage({ id: "violation-title" })}</title>
      </Helmet>
      <div className="main-title">
        <FormattedMessage id="record-table-title"></FormattedMessage>
      </div>
      <TableProvider>
        <ViolationDemo />
      </TableProvider>
    </HelmetProvider>
  );
}
