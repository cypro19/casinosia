import { Table } from "@themesberg/react-bootstrap";
import React from "react";
import { getTextColor } from "../../utils/dashboardEffects";

export default ({ KPIReport }) => {
  return (
    <div style={{ overflow: "auto", maxHeight: "385px" }}>
      <Table bordered striped hover size="sm" className="text-center mt-4">
        <thead className="thead-dark">
          <tr>
            <th className="text-left">Provider/Client</th>
            <th>GGR</th>
            {/* <th>Delta GGR</th> */}
            <th>Real Bet</th>
            <th>Real Win</th>
            <th>Bonus Bet</th>
            <th>Bonus Win</th>
            <th>Bonus GGR</th>
            <th>Total Bets</th>
            {/* <th>Delta Total Bets</th> */}
          </tr>
        </thead>

        <tbody>
          {KPIReport &&
            Object.keys(KPIReport)?.map((key, index) => {
              return (
                <tr key={index}>
                  <td className="text-left">{key?.split(":")?.[1] || key}</td>
                  <td className={getTextColor(KPIReport[key]?.GGR)}>
                    € {KPIReport[key]?.GGR}
                  </td>
                  {/* <td className={getTextColor(KPIReport[key]?.deltaGGR)}>
                  {KPIReport[key]?.deltaGGR}
                </td> */}
                  <td className={getTextColor(KPIReport[key]?.realBet)}>
                    € {KPIReport[key]?.realBet}
                  </td>
                  <td className={getTextColor(KPIReport[key]?.realWin)}>
                    € {KPIReport[key]?.realWin}
                  </td>
                  <td className={getTextColor(KPIReport[key]?.bonusBet)}>
                    € {KPIReport[key]?.bonusBet}
                  </td>
                  <td className={getTextColor(KPIReport[key]?.bonusWin)}>
                    € {KPIReport[key]?.bonusWin}
                  </td>
                  <td className={getTextColor(KPIReport[key]?.bonusGGR)}>
                    € {KPIReport[key]?.bonusGGR}
                  </td>
                  <td className={getTextColor(KPIReport[key]?.totalBets)}>
                    € {KPIReport[key]?.totalBets}
                  </td>
                  {/* <td className={getTextColor(KPIReport[key]?.deltaTotalBets)}>{KPIReport[key]?.deltaTotalBets}</td> */}
                </tr>
              );
            })}

          {(!KPIReport || Object.keys(KPIReport) < 1) && (
            <tr>
              <td className="text-danger" colSpan={10}>
                No Data Found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
