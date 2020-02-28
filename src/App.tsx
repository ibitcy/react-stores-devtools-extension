/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Layout } from "components/atoms/Layout";
import { Loader } from "components/atoms/Loader";
import { StoreInspect } from "components/organisms/StoreInspect";
import { StoreList } from "components/organisms/StoresList";
import { useInstance } from "hooks/useInstance";
import * as React from "react";
import { useGlobalState } from "hooks/useGlobalState";
import { StoreHistory } from "components/organisms/StoreHistory";

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
              For old version of react-stores connect with devtool followed{" "}
              <a css={link} href="#">
                instruction
              </a>
              .
            </span>
          }
        />
      ) : (
        <Layout name={instance.port.name}>
          <StoreList storesKeys={storesKeys} />
          {activeStore && instance?.stores?.has(activeStore) && (
            <StoreInspect />
          )}
          {activeStore && instance?.stores?.has(activeStore) && (
            <StoreHistory />
          )}
        </Layout>
      )}
    </React.Fragment>
  );
};

const description = css`
  font-size: 10px;
  text-align: center;
  line-height: 20px;
`;

const link = css`
  color: var(--text-base-color);
`;
