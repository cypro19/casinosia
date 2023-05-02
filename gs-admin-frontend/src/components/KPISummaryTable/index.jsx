import { Table } from "@themesberg/react-bootstrap";
import React from "react";
import { getTextColor } from "../../utils/dashboardEffects";

export default ({ KPISummary }) => {
  return (
    <div style={{ overflow: "auto", maxHeight: "700px" }}>
      <Table bordered striped hover size="sm" className="text-center mt-4">
        <thead className="thead-dark">
          <tr>
            <th className="text-left">Data</th>
            <th>Today</th>
            <th>Yesterday</th>
            <th>This Month</th>
            {/* <th>Previous Month To Date</th> */}
            <th>Selected Date</th>
            {/* <th>Delta</th> */}
          </tr>
        </thead>

        <tbody>
          {KPISummary &&
            KPISummary?.map(
              (
                {
                  rowName,
                  today,
                  yesterday,
                  monthToDate,
                  prevMonthToDate,
                  customDate,
                  delta,
                  type,
                },
                index
              ) => {
                return (
                  <tr key={index}>
                    <td className="text-left">{rowName}</td>
                    <td className={getTextColor(today)}>
                      {type === "amount" && "€ "}
                      {today}
                    </td>
                    <td className={getTextColor(yesterday)}>
                      {type === "amount" && "€ "}
                      {yesterday}
                    </td>
                    <td className={getTextColor(monthToDate)}>
                      {type === "amount" && "€ "}
                      {monthToDate}
                    </td>
                    {/* <td className={getTextColor(prevMonthToDate)}>{type === 'amount' && '€ '}{prevMonthToDate}</td> */}
                    <td className={getTextColor(customDate)}>
                      {type === "amount" && "€ "}
                      {customDate}
                    </td>
                    {/* <td className={getTextColor(delta)}>{delta}</td> */}
                  </tr>
                );
              }
            )}
        </tbody>

        {KPISummary?.length < 1 && (
          <td className="text-danger" colSpan={3}>
            No Data Found.
          </td>
        )}
      </Table>
    </div>
  );
};
