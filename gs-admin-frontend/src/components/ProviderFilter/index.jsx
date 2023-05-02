import React from "react";
import { Form } from "@themesberg/react-bootstrap";
import useAllProviderList from "./useAllProviderList";

const ProvidersFilter = ({ setSelectedProvider, selectedProvider }) => {
  const { allProviders } = useAllProviderList();

  return (
    <>
      <Form.Label style={{ marginRight: "15px", marginBottom: "0px" }}>
        Provider
      </Form.Label>

      <Form.Select
        onChange={(e) => {
          setSelectedProvider(e.target.value);
        }}
        value={selectedProvider}
        style={{ maxWidth: "230px" }}
        size="sm"
      >
        <option value="">All</option>

        {allProviders?.count === 0 && (
          <option value="" disabled>
            No Providers Available
          </option>
        )}

        {allProviders?.rows?.map(({ masterCasinoProviderId, name }) => (
          <option key={masterCasinoProviderId} value={masterCasinoProviderId}>
            {name}
          </option>
        ))}
      </Form.Select>
    </>
  );
};

export default ProvidersFilter;
