import "reflect-metadata";
import { Store, StoreEventType } from "react-stores";
import { Expose, plainToClass } from "class-transformer";
import { Store as Store4 } from "./oldstores_4.0.2.js";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { App } from "./App";

class User {
  @Expose() id: number;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose()
  get name() {
    return this.firstName + " " + this.lastName;
  }
}

const fromPlainUser = {
  unkownProp: "hello there",
  firstName: "Umed",
  lastName: "Khudoiberdiev"
};

setTimeout(() => {
  const store = new Store(
    {
      test: "name"
    },
    {
      persistence: true
    }
  );

  const options = {
    persistence: true
  };
  const storeOld = new Store4(
    {
      test: "name",
      newField: Date.now()
    },
    {
      persistence: true
    }
  );

  window["__REACT_STORES_INSPECTOR__"].attachStore(
    storeOld,
    "Old Store",
    options
  );

  class Profile {
    constructor(surname?: string) {
      this.surname = surname;
    }
    public surname = null;
    public method = (a, b) => {};
    public name = "test";
  }

  const pro = new Profile("surname");

  const PlainClass = plainToClass(User, fromPlainUser);

  const map = new Map();
  const mapDiff = new Map();
  const handle = function(a, b) {
    a.toString();
    b.toString();
    return a + b;
  };
  map.set(15, { name: "Yjin", number: 10 });
  map.set(10, { name: "Yjin", number: 25 });
  mapDiff.set(10, { name: "Yjin", number: 25 });
  mapDiff.set("NAME", { name: "Yjin", number: 25 });
  mapDiff.set(Symbol("id"), { name: "Yjin", number: 25 });

  const store2 = new Store(
    {
      string: "adsfadfasdf",
      null: null,
      plainClass: PlainClass,
      class: new Profile(),
      mapDiffKeys: mapDiff,
      pro,
      classFuncion: new Profile().method,
      symbol: Symbol("foo"),
      numberString: "1582668000650",
      date: new Date(1582668000650),
      regExp: /[\d]/g,
      func: (value: number) => value.toString(),
      handle,
      newField: 0,
      floatNum: 1.1214243,
      numberE: 123e-5,
      undef: undefined,
      nan: NaN,
      array: [1, 2, 3],
      arrayDiffTypes: [
        1,
        "string",
        false,
        undefined,
        {
          id: 1,
          name: 15
        },
        new Profile(),
        PlainClass,
        Symbol("foo"),
        new Date(1582668000650),
        /[\d]/g,
        (value: number) => value.toString(),
        map,
        {
          id: 1,
          name: 15
        },
        {
          id: 1,
          name: 15
        },
        {
          15: "asd",
          string: "adsfasdf",
          asdfa: "adsfasdf",
          asdgasdg: NaN,
          asd: false,
          sdgfsd: "adsfasdf",
          number: 15,
          sadfas: undefined
        }
      ],
      number: 1,
      boolean: true,
      map,
      list: [
        {
          id: 1,
          name: 15
        },
        {
          id: 1,
          name: 15
        },
        {
          id: 1,
          name: 15
        }
      ],
      object: {
        string: "adsfasdf",
        asdfa: "adsfasdf",
        asdgasdg: NaN,
        newField: Date.now(),
        asd: false,
        plainClass: PlainClass,
        sdgfsd: "adsfasdf",
        number: 15,
        class: new Profile(),
        symbol: Symbol("foo"),
        date: new Date(1582668000650),
        regExp: /[\d]/g,
        func: (value: number) => value.toString(),
        sadfas: undefined
      }
    },
    {
      name: "Big store"
    }
  );

  setTimeout(() => {
    store2.setState({
      string: "name_test",
      $actionName: "@group/myfirst"
    });
  }, 1000);
  setTimeout(() => {
    store2.setState({
      string: "name_new",
      $actionName: "@group/mysecond"
    });
  }, 1000);
  setTimeout(() => {
    store2.setState({
      string: "name_new",
      $actionName: "@group2/sup"
    });
  }, 3000);
  setTimeout(() => {
    store2.setState({
      string: "name_ne_name",
      $actionName: "@group2/sup"
    });
  }, 4000);

  function test() {
    StaticClass.method();
  }

  class StaticClass {
    public static method() {
      obj.zzz();
    }
  }

  const obj = {
    zzz: () => {
      store2.setState({
        string: "long",
        $actionName: "@longTrace"
      });
    }
  };

  test();
  const state = store2.state;
  setInterval(() => {
    storeOld.setState({
      newField: Date.now()
    });
    store2.setState({
      newField: Date.now(),
      array: [...store2.state.array, Date.now()],
      object: {
        ...store2.state.object,
        newField: Date.now()
      },
      $actionName: "@this_is_update"
    });
    store2.on(StoreEventType.Update, () => {});
  }, 10000);
}, 1000);

setTimeout(() => {
  const store = new Store(
    {
      test: "name"
    },
    { name: "Delayed store", live: true }
  );
}, 5000);

window["store"] = Store;

ReactDOM.render(<App />, document.getElementById("app"));
