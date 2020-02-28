/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Layout } from "components/atoms/Layout";
import { Loader } from "components/atoms/Loader";
import { StoreInspect } from "components/organisms/StoreInspect";
import { StoreList } from "components/organisms/StoresList";
import { useInstance } from "hooks/useInstance";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";

interface IProps {}

export const App: React.FC<IProps> = () => {
  const instance = useInstance();
  const { activeStore } = useGlobalState();

  const storesKeys = instance ? Array.from(instance.stores.keys()) : [];

  return (
    <React.Fragment>
      {storesKeys.length === 0 ? (
        <Loader
          message="No store found."
          postfix={
            <span css={description}>
              Make sure to use react-stores v5.0.0 or higher.
              <br />
              Or connect with old store follow instruction.
            </span>
          }
        />
      ) : (
        <Layout name={instance.port.name}>
          <StoreList storesKeys={storesKeys} />
          {activeStore && instance?.stores?.has(activeStore) && (
            <StoreInspect />
          )}
        </Layout>
      )}
    </React.Fragment>
  );
};

const description = css`
  font-size: 10px;
`;
