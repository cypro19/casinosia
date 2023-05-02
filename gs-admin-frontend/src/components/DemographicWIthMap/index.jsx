import React from "react";
import { Row, Col, Table } from "@themesberg/react-bootstrap";
import Highcharts from "highcharts";
import HighchartsMap from "highcharts/modules/map";
import HighchartsReact from "highcharts-react-official";
import "./demographicReport.css";
import { tableHeaders } from "./demographicConstant";
import { countryFilter } from "../../utils/countryFilter";

const DemographicWithMap = ({ options, demogData, formatedData }) => {
  HighchartsMap(Highcharts);
  return (
    <>
      <Row>
        <Col sm={6}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            constructorType="mapChart"
          />
          <div className="demographicCharts">
            <div className="d-charts first" />{" "}
            <span className="first">0-1000</span>
            <div className="d-charts second" />{" "}
            <span className="second">1000-100000</span>
            <div className="d-charts third" />{" "}
            <span className="third">{">100000"}</span>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{ overflow: "auto", maxHeight: "400px " }}>
            <Table hover size="sm" className="text-center mt-4 fixTableHead">
              <thead className="thead-dark">
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th key={`T-table_heading ${idx}`}>{h.label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {demogData &&
                  demogData.map(
                    ({
                      country_code: countryCode,
                      signUpCount,
                      conversionRate,
                      depositAmount,
                      depositCount,
                    }) => {
                      const { countryName } = countryFilter(countryCode);
                      return (
                        <tr key={`demo-g-data ${countryCode}`}>
                          <td className="text-left">{countryName || "NA"}</td>
                          <td>{signUpCount || "0"}</td>
                          <td>{depositCount || "0"}</td>
                          <td style={{ color: "#4CAF50" }}>
                            {depositAmount ? `€ ${depositAmount}` : "0.00"}
                          </td>
                          <td>{conversionRate || "0.00"} %</td>
                        </tr>
                      );
                    }
                  )}

                {demogData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-danger text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default DemographicWithMap;
