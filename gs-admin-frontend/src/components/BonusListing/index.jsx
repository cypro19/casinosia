import {
  faCheckSquare,
  faCopy,
  faEdit,
  faEye,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup, Table } from "@themesberg/react-bootstrap";
import React from "react";
import { formatDate } from "../../utils/dateFormatter";
import ConfirmationModal from "../ConfirmationModal";
import Trigger from "../OverlayTrigger";
import PaginationComponent from "../Pagination";
import { bonusType } from "../../pages/Admin/Bonus/components/CreateBonus/constants";
import useCheckPermission from "../../utils/checkPermission";

export default ({
  bonusList,
  limit,
  setLimit,
  page,
  setPage,
  totalPages,
  tableHeaders,
  show,
  setShow,
  handleYes,
  active,
  handleShow,
  navigate,
}) => {
  const { isHidden } = useCheckPermission();

  return (
    <>
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
            {tableHeaders.map((h, idx) => (
              <th key={`T-table_heading ${idx}`}>{h.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {bonusList &&
            bonusList?.rows?.map(
              ({
                bonusId,
                promotionTitle,
                isActive,
                bonusType: type,
                adminUser,
                validTo,
                claimedCount,
                isSticky,
              }) => {
                return (
                  <tr key={`bonus-list ${bonusId}`}>
                    <td>{bonusId}</td>
                    <td>{promotionTitle?.EN || "NA"}</td>
                    <td>
                      {type === "freespins" && !isSticky
                        ? "FREESPINS"
                        : bonusType.find((val) => val.value === type)?.label}
                    </td>
                    <td>{type === "deposit" ? "-" : formatDate(validTo)}</td>
                    <td>
                      {type === "deposit"
                        ? "No"
                        : formatDate(validTo) < formatDate(new Date())
                        ? "Yes"
                        : "No"}
                    </td>
                    <td>{claimedCount ? "Yes" : "No"}</td>
                    <td>
                      {isActive ? (
                        <span className="text-success">Active</span>
                      ) : (
                        <span className="text-danger">In-Active</span>
                      )}
                    </td>
                    <td>
                      <ButtonGroup>
                        <Trigger message="View">
                          <Button
                            className="m-1"
                            size="sm"
                            variant="info"
                            hidden={isHidden({
                              module: { key: "Bonus", value: "R" },
                            })}
                            onClick={() =>
                              navigate(`/${"admin"}/bonus-details/${bonusId}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        </Trigger>
                        <Trigger message="Edit">
                          <Button
                            disabled={claimedCount}
                            className="m-1"
                            size="sm"
                            variant="info"
                            hidden={isHidden({
                              module: { key: "Bonus", value: "U" },
                            })}
                            onClick={() =>
                              navigate(`/${"admin"}/edit-bonus/${bonusId}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </Trigger>
                        {!isActive ? (
                          <Trigger message="Set Status Active">
                            <Button
                              className="m-1"
                              size="sm"
                              variant="success"
                              hidden={isHidden({
                                module: { key: "Bonus", value: "T" },
                              })}
                              onClick={() => handleShow(bonusId, isActive)}
                            >
                              <FontAwesomeIcon icon={faCheckSquare} />
                            </Button>
                          </Trigger>
                        ) : (
                          <Trigger message="Set Status In-Active">
                            <Button
                              className="m-1"
                              size="sm"
                              variant="danger"
                              hidden={isHidden({
                                module: { key: "Bonus", value: "T" },
                              })}
                              onClick={() => handleShow(bonusId, isActive)}
                            >
                              <FontAwesomeIcon icon={faWindowClose} />
                            </Button>
                          </Trigger>
                        )}
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              }
            )}

          {bonusList?.count === 0 && (
            <tr>
              <td colSpan={10} className="text-danger text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {bonusList?.count > 0 && (
        <PaginationComponent
          page={bonusList?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}

      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
        />
      )}
    </>
  );
};
