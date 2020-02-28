enum EProtocolTypes {
  NAN,
  UNDEFINED,
  DATE,
  MAP,
  FUNCTION,
  REGEXP,
  SYMBOL,
  CUSTOM_CLASS
}

export function encodeData(obj: Record<string, any>): string {
  const string = JSON.stringify(obj, (key, value) => {
    if (typeof value === "number" && isNaN(value)) {
      return { __DEV_PROTOCOL__: true, type: EProtocolTypes.NAN };
    }
    if (typeof value === "undefined") {
      return { __DEV_PROTOCOL__: true, type: EProtocolTypes.UNDEFINED };
    }
    if (
      (typeof value === "string" && Date.parse(value)) ||
      value instanceof Date
    ) {
      return {
        __DEV_PROTOCOL__: true,
        type: EProtocolTypes.DATE,
        value: new Date(value).getTime() + "_"
      };
    }
    if (value instanceof Map) {
      return {
        __DEV_PROTOCOL__: true,
        type: EProtocolTypes.MAP,
        value: Array.from(value.entries())
      };
    }
    if (typeof value === "function") {
      return {
        __DEV_PROTOCOL__: true,
        type: EProtocolTypes.FUNCTION,
        value: value.toString()
      };
    }
    if (value instanceof RegExp) {
      return {
        __DEV_PROTOCOL__: true,
        type: EProtocolTypes.REGEXP,
        value: {
          source: value.source,
          flags: value.flags
        }
      };
    }
    if (typeof value === "symbol") {
      return {
        __DEV_PROTOCOL__: true,
        type: EProtocolTypes.SYMBOL,
        value: (value as any).description
      };
    }

    if (
      value &&
      Object.getPrototypeOf(value)?.constructor?.name &&
      ["Object", "Boolean", "String", "Number", "Array"].indexOf(
        Object.getPrototypeOf(value)?.constructor?.name
      ) === -1
    ) {
      return {
        __DEV_PROTOCOL__: true,
        type: EProtocolTypes.CUSTOM_CLASS,
        value: { ...value },
        constructorName: Object.getPrototypeOf(value)?.constructor?.name
      };
    }
    return value;
  });
  return string;
}

export function decodeData(string: string): Record<string, any> {
  return JSON.parse(string, (key, value) => {
    if (typeof value === "object" && value?.__DEV_PROTOCOL__) {
      switch (value.type) {
        case EProtocolTypes.NAN: {
          return NaN;
        }
        case EProtocolTypes.UNDEFINED: {
          return "undefined";
        }
        case EProtocolTypes.DATE: {
          return new Date(parseInt(value.value, 10));
        }
        case EProtocolTypes.MAP: {
          return new Map(value.value);
        }
        case EProtocolTypes.FUNCTION: {
          return new Function(`return ${value.value}`)();
        }
        case EProtocolTypes.REGEXP: {
          return new RegExp(value.value.source, value.value.flags);
        }
        case EProtocolTypes.SYMBOL: {
          return Symbol(value.value);
        }
        case EProtocolTypes.CUSTOM_CLASS: {
          const obj = {
            ...value.value,
            __constructorName: value.constructorName
          };
          return obj;
        }
      }
    }
    return value;
  });
}
