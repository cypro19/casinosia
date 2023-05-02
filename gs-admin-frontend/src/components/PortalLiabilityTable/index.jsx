import { Table } from "@themesberg/react-bootstrap";
import React from "react";
import { currencySymbols } from "./constant";

export default ({ playerLiabilityData }) => {
  return (
    <Table
      bordered
      striped
      responsive
      hover
      size="sm"
      className="text-center mt-4"
    >
      <thead className="thead-dark">
        <tr>
          <th>Currency</th>
          <th>Liability</th>
        </tr>
      </thead>

      <tbody>
        {playerLiabilityData &&
          playerLiabilityData?.map(({ liability, currencyCode }, index) => {
            return (
              <tr key={index}>
                <td>{currencyCode}</td>
                <td>
                  {currencySymbols[currencyCode]} {liability}
                </td>
              </tr>
            );
          })}
      </tbody>

      <tbody>
        <tr>
          {playerLiabilityData?.length < 1 && (
            <td className="text-danger" colSpan={3}>
              No Data Found.
            </td>
          )}
        </tr>
      </tbody>
    </Table>
  );
};
