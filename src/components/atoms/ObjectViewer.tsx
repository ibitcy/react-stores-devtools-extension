/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { Hightlighter } from "./Hightlighter";

interface IProps {
  obj: Record<string | number, any> | Array<any>;
  flat?: boolean;
  noHightlight?: boolean;
}

export const ObjectViewer: React.FC<IProps> = ({ obj, flat, noHightlight }) => {
  const iterable = React.useMemo(() => {
    if (isMap(obj)) {
      const iterable = {};
      obj.forEach((v: any, k: any) => {
        iterable[String(k)] = v;
      });
      return iterable;
    }

    return obj;
  }, [obj]);

  const filtered = React.useMemo(() => getFilteredObjKeys(iterable), [
    iterable
  ]);

  const hasCollapsible = React.useMemo(
    () => filtered.some(key => isTypeCollapsible(iterable[key])),
    [filtered]
  );

  return (
    <div css={[root, flat || (!hasCollapsible && flatRoot)]}>
      {filtered.map((key: any) => (
        <Item
          value={iterable[key]}
          key={key}
          keyString={key}
          noHightlight={noHightlight}
        />
      ))}
    </div>
  );
};

interface IItemProps {
  value: any;
  keyString: string;
  noHightlight: boolean;
}

const Item: React.FC<IItemProps> = ({ value, keyString, noHightlight }) => {
  const [open, setOpen] = React.useState(false);
  const isCollapsible = React.useMemo(() => isTypeCollapsible(value), [value]);

  return (
    <React.Fragment>
      <div
        css={[
          item,
          isCollapsible && itemCollapsible,
          open && itemCollapsibleOpen
        ]}
        onClick={() => {
          if (isCollapsible) {
            setOpen(!open);
          }
        }}
      >
        <span css={itemKey}>
          <span className="value"> {keyString}</span>:
        </span>
        <span css={valueCn}>
          <Hightlighter disable={open || noHightlight} deepEqual watch={value}>
            {domForType(value, open)}
          </Hightlighter>
        </span>
      </div>
      {isCollapsible && open && <ObjectViewer obj={value} />}
    </React.Fragment>
  );
};

function isTypeCollapsible(value: any) {
  if (Array.isArray(value)) {
    return Boolean(value.length);
  }
  if (isMap(value)) {
    return Boolean(value.size);
  }
  if (typeof value === "object" && value !== null) {
    return (
      Boolean(Object.keys(value).length) &&
      value.$prev === undefined &&
      value.$current === undefined
    );
  }

  return false;
}

function domForType(value: any, open: boolean) {
  if (
    ["number", "boolean", "undefined", "string", "symbol"].some(
      type => typeof value === type
    ) ||
    value === null
  ) {
    return simpleType(value);
  }
  if (typeof value === "function") {
    return functionType(value);
  }

  if (Array.isArray(value)) {
    return arrayType(value, open);
  }

  if (isRegExp(value)) {
    return <span css={redCn}>{value.toString()}</span>;
  }

  if (isMap(value)) {
    return mapType(value, open);
  }

  if (isDate(value)) {
    return <span css={greyCn}>{value.toString()}</span>;
  }

  if (typeof value === "object") {
    return objectType(value, open);
  }

  return JSON.stringify(value);
}

function simpleType(
  value: string | number | null | undefined | boolean | object
): React.ReactNode {
  if (value === "undefined" || typeof value === "undefined") {
    return <span css={greyCn}>undefined</span>;
  }
  if (typeof value === "number" && isNaN(value)) {
    return <span css={blueCn}>NaN</span>;
  }
  if (value === null) {
    return <span css={greyCn}>null</span>;
  }
  if (typeof value === "number") {
    return <span css={blueCn}>{value}</span>;
  }
  if (typeof value === "function") {
    return <i>ƒ</i>;
  }
  if (typeof value === "boolean") {
    return <span css={blueCn}>{value ? "true" : "false"}</span>;
  }
  if (typeof value === "string") {
    return (
      <span>
        "<span css={redCn}>{value}</span>"
      </span>
    );
  }

  if (typeof value === "symbol") {
    return <span css={redCn}>Symbol({(value as any).description})</span>;
  }

  if (isRegExp(value)) {
    return <span css={redCn}>{value.toString()}</span>;
  }

  if (isMap(value)) {
    return <span>Map({(value as Map<any, any>).size})</span>;
  }

  if (isDate(value)) {
    return <span>Date</span>;
  }

  if (typeof value === "object") {
    if (value.hasOwnProperty("$prev") && value.hasOwnProperty("$current")) {
      return <span css={uptaded}>»</span>;
    }
    return (
      <span>
        {!value["__constructorName"] ? (
          <span>
            {"{"}…{"}"}
          </span>
        ) : (
          value["__constructorName"]
        )}
      </span>
    );
  }

  return null;
}

function arrayType(arr: Array<any>, open: boolean): React.ReactNode {
  if (open) {
    return <span>Array({arr.length})</span>;
  }
  return (
    <span>
      <span css={greyCn}>({arr.length}) </span>[
      {arr.map((item, i, arr) => (
        <span key={i}>
          {simpleType(item)}
          {i !== arr.length - 1 && ", "}
        </span>
      ))}
      ]
    </span>
  );
}

function functionType(value: any): React.ReactNode {
  return (
    <i>
      <span css={blueCn}>ƒ</span> (
      {/function \((.*)\) \{/.exec(value.toString())?.[1]})
    </i>
  );
}

function mapType(map: Map<any, any>, open: boolean): React.ReactNode {
  if (open) {
    return <span>Map({map.size})</span>;
  }
  return (
    <span>
      <span css={greyCn}>Map({map.size}) </span>
      {"{"}
      {Array.from(map.entries())
        .filter(item => item)
        .map((item, i, arr) => (
          <span key={i}>
            {simpleType(item[0])} => {simpleType(item[1])}
            {i !== arr.length - 1 && ", "}
          </span>
        ))}
      {"}"}
    </span>
  );
}

function objectType(
  obj: Record<number | string, any>,
  open: boolean
): React.ReactNode {
  if (open) {
    return obj.__constructorName && <span>{obj.__constructorName} </span>;
  }
  if (obj.hasOwnProperty("$prev") && obj.hasOwnProperty("$current")) {
    return (
      <span>
        <span css={prevValue}>{simpleType(obj.$prev)}</span>
        <span css={currentValue}>⇨ {simpleType(obj.$current)}</span>
      </span>
    );
  }
  return (
    <span>
      {obj.__constructorName && (
        <span css={greyCn}>{obj.__constructorName} </span>
      )}
      {"{"}
      {getFilteredObjKeys(obj).map((key, i, arr) => {
        const value = obj[key];
        return (
          <span key={i}>
            {key}: {simpleType(value)}
            {i !== arr.length - 1 && ", "}
          </span>
        );
      })}
      {"}"}
    </span>
  );
}

function isMap(value: any): boolean {
  return (
    value instanceof Map ||
    (typeof value === "object" && value?.entries && value?.set && value?.get)
  );
}

function isRegExp(value: any): boolean {
  return Object.getPrototypeOf(value)?.constructor?.name === "RegExp";
}

function isDate(value: any): boolean {
  return (
    Object.getPrototypeOf(value)?.constructor?.name === "Date" ||
    value instanceof Date ||
    (typeof value === "object" &&
      value?.getDate &&
      value?.getDay &&
      value?.getUTCMonth)
  );
}

function getFilteredObjKeys(
  obj: Record<string | number, any> | any[]
): string[] {
  return Object.keys(obj)
    .filter(item => item !== "__constructorName")
    .sort((a, b) => {
      if (!isNaN(+a) && !isNaN(+b)) {
        return parseInt(a) - parseInt(b);
      }
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
}

const root = css`
  color: var(--text-fade-color);
  padding: 0 8px 2px 12px;
  font-size: 11px;
`;

const flatRoot = css`
  padding-left: 4px;
`;

const item = css`
  margin-bottom: 1px;
  display: flex;
  padding: 2px 3px;
  padding-left: 12px;
  margin-left: -10px;
  position: relative;
  user-select: none;
`;

const itemCollapsible = css`
  &::after {
    content: "▼";
    font-size: 10px;
    display: block;
    position: absolute;
    left: 0;
    top: calc(50% - 5px);
    transform: rotate(-90deg);
  }
`;

const itemCollapsibleOpen = css`
  &::after {
    transform: rotate(0deg);
  }
`;

const itemKey = css`
  color: var(--text-base-color);
  font-weight: bold;
  padding-right: 8px;

  .value {
    font-weight: normal;
    color: var(--code-value);
  }
`;

const valueCn = css`
  color: var(--text-base-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const blueCn = css`
  color: var(--code-blue);
`;

const greyCn = css`
  color: var(--code-grey);
`;

const redCn = css`
  color: var(--code-red);
`;

const prevValue = css`
  font-style: italic;
  margin-right: 5px;
  opacity: 0.5;
`;

const currentValue = css``;
const uptaded = css`
  width: 10px;
  text-align: center;
  height: 10px;
  line-height: 0;
  position: relative;
  top: -1px;
  border-radius: 2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: var(--box-bg-color);
`;
