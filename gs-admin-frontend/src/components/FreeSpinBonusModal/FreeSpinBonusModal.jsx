import { Form, Modal, Table } from "@themesberg/react-bootstrap";
import React, { useEffect } from "react";
import { getAllCasinoGames, getMasterGames } from "../../utils/apiCalls";
import FreeSpinForm from "./FreeSpinForm";
import useFreeSpinBonusModal from "./useFreeSpinBonusModal";
import Preloader from "../../components/Preloader";

export default ({ show, setShow }) => {
  const {
    search,
    setSearch,
    gameIds,
    handleSelect,
    handleSelectAll,
    availableGames,
    getData,
    bonusOptions,
    submitData,
    setGamesData,
    loading,
  } = useFreeSpinBonusModal();

  useEffect(() => {
    async function fetchData() {
      await getAllCasinoGames({
        limit: "",
        pageNo: "",
        casinoCategoryId: "",
        search: "",
        isActive: "",
        selectedProvider: "",
        freespins: true,
        bonusId: "",
      }).then((res) => {
        setGamesData(res?.data?.data?.casinoGames);
      });
    }
    fetchData();
  }, []);

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Issue Freespins</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            type="search"
            name="search"
            placeholder="Search Game"
            className="w-25"
            size="sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="d-flex mt-2">
            <div
              style={{
                overflow: "auto",
                maxHeight: "400px",
                width: "60%",
                marginRight: "10px",
              }}
            >
              <Table size="sm" className="text-center">
                <thead>
                  <tr className="thead-dark">
                    <th>
                      <input
                        name="selectAll"
                        type="checkbox"
                        checked={gameIds?.length >= availableGames?.length}
                        onChange={(e) => handleSelectAll(e)}
                      />
                    </th>
                    <th>Game Id</th>
                    <th>Game Name</th>
                  </tr>
                </thead>

                {!loading && (
                  <tbody>
                    {availableGames?.length > 0 &&
                      availableGames?.map(({ masterCasinoGameId, name }) => {
                        return (
                          <tr key={`games-list ${masterCasinoGameId}`}>
                            <td>
                              <input
                                name={masterCasinoGameId}
                                type="checkbox"
                                checked={gameIds?.includes(masterCasinoGameId)}
                                value={masterCasinoGameId}
                                onChange={(e) =>
                                  handleSelect(e, masterCasinoGameId)
                                }
                              />
                            </td>
                            <td>{masterCasinoGameId}</td>
                            <td>{name}</td>
                          </tr>
                        );
                      })}
                    {availableGames?.count === 0 && (
                      <tr>
                        <td colSpan={2} className="text-danger text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </Table>
            </div>
            <div style={{ overflow: "auto", maxHeight: "400px", width: "40%" }}>
              <Table size="sm" className="text-center">
                <thead>
                  <tr className="thead-dark">
                    <th>Selected Games</th>
                  </tr>
                </thead>
                <tbody>
                  {gameIds?.length > 0 &&
                    gameIds?.map((gameId) => {
                      return (
                        <tr key={`games-list ${gameId}`}>
                          <td>
                            {getData("name", gameId)} ( GameId:{" "}
                            {getData("id", gameId)} )
                          </td>
                        </tr>
                      );
                    })}
                  {gameIds?.length === 0 && (
                    <tr>
                      <td colSpan={1} className="text-danger text-center">
                        No Games Selected
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
          <FreeSpinForm
            bonusOptions={bonusOptions}
            setShow={setShow}
            gameIds={gameIds}
            submitData={submitData}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
