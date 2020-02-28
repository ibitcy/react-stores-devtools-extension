"use strict";
function _interopDefault(t) {
  return t && "object" == typeof t && "default" in t ? t.default : t;
}
Object.defineProperty(exports, "__esModule", { value: !0 });
var React = require("react"),
  React__default = _interopDefault(React),
  extendStatics = function(t, e) {
    return (extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(t, e) {
          t.__proto__ = e;
        }) ||
      function(t, e) {
        for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
      })(t, e);
  };
function __extends(t, e) {
  function r() {
    this.constructor = t;
  }
  extendStatics(t, e),
    (t.prototype =
      null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
}
var __assign = function() {
  return (__assign =
    Object.assign ||
    function(t) {
      for (var e, r = 1, i = arguments.length; r < i; r++)
        for (var n in (e = arguments[r]))
          Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
      return t;
    }).apply(this, arguments);
};
function __spreadArrays() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++)
    t += arguments[e].length;
  var i = Array(t),
    n = 0;
  for (e = 0; e < r; e++)
    for (var o = arguments[e], s = 0, a = o.length; s < a; s++, n++)
      i[n] = o[s];
  return i;
}
!(function(t) {
  (t[(t.All = 0)] = "All"),
    (t[(t.Init = 1)] = "Init"),
    (t[(t.Update = 2)] = "Update"),
    (t[(t.DumpUpdate = 3)] = "DumpUpdate");
})(exports.StoreEventType || (exports.StoreEventType = {}));
var StoreEvent = (function() {
    function t(t, e, r, i) {
      (this.id = t),
        (this.types = e),
        (this.onFire = r),
        (this.onRemove = i),
        (this.timeout = null);
    }
    return (
      (t.prototype.remove = function() {
        this.timeout && clearTimeout(this.timeout), this.onRemove(this.id);
      }),
      t
    );
  })(),
  StoreEventSpecificKeys = (function() {
    function t(t, e, r, i, n) {
      void 0 === n && (n = []),
        (this.id = t),
        (this.types = e),
        (this.onFire = r),
        (this.onRemove = i),
        (this.includeKeys = n),
        (this.timeout = null);
    }
    return (
      (t.prototype.remove = function() {
        this.timeout && clearTimeout(this.timeout), this.onRemove(this.id);
      }),
      t
    );
  })(),
  followStore = function(t) {
    return function(e) {
      return (function(r) {
        function i() {
          var t = (null !== r && r.apply(this, arguments)) || this;
          return (t.storeEvent = null), (t.state = { storeState: null }), t;
        }
        return (
          __extends(i, r),
          (i.prototype.componentWillMount = function() {
            var e = this;
            this.storeEvent = t.on(exports.StoreEventType.All, function() {
              e.forceUpdate();
            });
          }),
          (i.prototype.componentWillUnmount = function() {
            this.storeEvent.remove();
          }),
          (i.prototype.render = function() {
            return React.createElement(e, this.props);
          }),
          i
        );
      })(React.Component);
    };
  },
  StorePersistentDriver = (function() {
    function t(t, e) {
      void 0 === e && (e = 1 / 0),
        (this.name = t),
        (this.lifetime = e),
        (this.persistence = !0),
        (this.initialState = null);
    }
    return (
      (t.prototype.pack = function(t) {
        return { data: t, timestamp: Date.now() };
      }),
      (t.prototype.reset = function() {
        var t = this.pack(this.initialState);
        return this.write(t), t;
      }),
      Object.defineProperty(t.prototype, "storeName", {
        get: function() {
          return (
            "store.persistent." +
            this.type +
            "." +
            this.name
          ).toLowerCase();
        },
        enumerable: !0,
        configurable: !0
      }),
      Object.defineProperty(t.prototype, "dumpHistoryName", {
        get: function() {
          return (
            "store.persistent.dump.history." +
            this.type +
            "." +
            this.name
          ).toLowerCase();
        },
        enumerable: !0,
        configurable: !0
      }),
      t
    );
  })(),
  StorePersistentLocalStorageDriver = (function(t) {
    function e(e, r) {
      void 0 === r && (r = 1 / 0);
      var i = t.call(this, e, r) || this;
      return (
        (i.name = e),
        (i.lifetime = r),
        (i.storage = null),
        (i.type = "localStorage"),
        "undefined" != typeof window &&
          window.localStorage &&
          (i.storage = window.localStorage),
        i
      );
    }
    return (
      __extends(e, t),
      (e.prototype.write = function(t) {
        if (this.storage && this.persistence)
          try {
            this.storage.setItem(this.storeName, JSON.stringify(t));
          } catch (t) {
            console.error(t);
          }
      }),
      (e.prototype.read = function() {
        if (this.storage && this.persistence) {
          var t = null;
          try {
            (t = JSON.parse(this.storage.getItem(this.storeName))),
              Boolean(t) || Boolean(t.timestamp) || (t = this.reset());
          } catch (e) {
            t = this.reset();
          }
          return t;
        }
        return this.reset();
      }),
      (e.prototype.saveDump = function(t) {
        var e = t.timestamp;
        if (this.storage && this.persistence)
          try {
            var r = JSON.parse(this.storage.getItem(this.dumpHistoryName));
            r && r.dumpHistory
              ? (r.dumpHistory.push(t),
                this.storage.setItem(this.dumpHistoryName, JSON.stringify(r)))
              : this.storage.setItem(
                  this.dumpHistoryName,
                  JSON.stringify({ dumpHistory: [t] })
                );
          } catch (r) {
            try {
              this.storage.setItem(
                this.dumpHistoryName,
                JSON.stringify({ dumpHistory: [t] })
              );
            } catch (t) {
              console.error(t), (e = null);
            }
            console.error(r), (e = null);
          }
        return e;
      }),
      (e.prototype.removeDump = function(t) {
        if (this.storage && this.persistence)
          try {
            var e = JSON.parse(this.storage.getItem(this.dumpHistoryName));
            if (e && e.dumpHistory) {
              var r = e.dumpHistory.filter(function(e) {
                return e.timestamp !== t;
              });
              this.storage.setItem(
                this.dumpHistoryName,
                JSON.stringify({ dumpHistory: r })
              );
            }
          } catch (t) {
            console.error(t);
          }
      }),
      (e.prototype.readDump = function(t) {
        var e = null;
        if (this.storage && this.persistence)
          try {
            var r = JSON.parse(this.storage.getItem(this.dumpHistoryName));
            e =
              r && r.dumpHistory
                ? r.dumpHistory.find(function(e) {
                    return e.timestamp === t;
                  })
                : null;
          } catch (t) {
            console.error(t);
          }
        return e;
      }),
      (e.prototype.getDumpHistory = function() {
        var t = [];
        if (this.storage && this.persistence)
          try {
            var e = JSON.parse(this.storage.getItem(this.dumpHistoryName));
            e &&
              e.dumpHistory &&
              (t = e.dumpHistory.map(function(t) {
                return t.timestamp;
              }));
          } catch (e) {
            console.error(e), (t = []);
          }
        return t;
      }),
      (e.prototype.resetHistory = function() {
        if (this.storage && this.persistence)
          try {
            this.storage.setItem(
              this.dumpHistoryName,
              JSON.stringify({ dumpHistory: [] })
            );
          } catch (t) {
            console.error(t);
          }
      }),
      (e.prototype.clear = function() {
        if (this.storage && this.persistence)
          try {
            this.storage.removeItem(this.storeName);
          } catch (t) {
            console.error(t);
          }
      }),
      e
    );
  })(StorePersistentDriver);
function isPrimitive(t) {
  switch (typeof t) {
    case "undefined":
    case "boolean":
    case "number":
    case "string":
    case "symbol":
      return !0;
    default:
      return !1;
  }
}
function areSimilar(t, e) {
  for (var r = [], i = 2; i < arguments.length; i++) r[i - 2] = arguments[i];
  if (t === e) return !0;
  if (isPrimitive(t) || isPrimitive(e)) return t === e;
  if (null === t || null === e) return !1;
  if (
    (Array.isArray(t) && !Array.isArray(e)) ||
    (!Array.isArray(t) && Array.isArray(e))
  )
    return !1;
  for (
    var n = new Set(r),
      o = new Set(Object.keys(t)),
      s = new Set(Object.keys(e)),
      a = 0,
      p = r;
    a < p.length;
    a++
  ) {
    var u = p[a];
    o.add(u), s.add(u);
  }
  if (o.size !== s.size) return !1;
  var c = Array.from(o),
    h = Array.from(s);
  c.sort(), h.sort();
  for (var f = c.length - 1; f >= 0; f--) if (c[f] !== h[f]) return !1;
  for (f = c.length - 1; f >= 0; f--) {
    u = c[f];
    if (!n.has(u) && !areSimilar.apply(void 0, __spreadArrays([t[u], e[u]], r)))
      return !1;
  }
  return typeof t == typeof e;
}
var StoreEventManager = (function() {
    function t(t) {
      (this.fireTimeout = t),
        (this.events = []),
        (this.eventCounter = 0),
        (this.timeout = null);
    }
    return (
      (t.prototype.generateEventId = function() {
        return "" + ++this.eventCounter + Date.now() + Math.random();
      }),
      (t.prototype.fire = function(t, e, r, i) {
        var n = this;
        if (i)
          this.fireTimeout && 0 !== this.fireTimeout
            ? (i.timeout && clearTimeout(this.timeout),
              (i.timeout = setTimeout(function() {
                n.doFire(t, e, r, i);
              }, this.fireTimeout)))
            : this.doFire(t, e, r, i);
        else if (this.fireTimeout && 0 !== this.fireTimeout)
          this.timeout && clearTimeout(this.timeout),
            (this.timeout = setTimeout(function() {
              for (var i in n.events)
                n.events.hasOwnProperty(i) && n.doFire(t, e, r, n.events[i]);
            }, this.fireTimeout));
        else
          for (var o in this.events)
            this.events.hasOwnProperty(o) &&
              this.doFire(t, e, r, this.events[o]);
      }),
      (t.prototype.remove = function(t) {
        if (this.fireTimeout && 0 !== this.fireTimeout)
          for (var e in this.events)
            this.events.hasOwnProperty(e) &&
              this.events[e].timeout &&
              clearTimeout(this.timeout);
        this.events = this.events.filter(function(e) {
          return e.id !== t;
        });
      }),
      (t.prototype.add = function(t, e, r) {
        var i,
          n = this;
        return (
          (i = r
            ? new StoreEventSpecificKeys(
                this.generateEventId(),
                t,
                e,
                function(t) {
                  n.remove(t);
                },
                r
              )
            : new StoreEvent(this.generateEventId(), t, e, function(t) {
                n.remove(t);
              })),
          this.events.push(i),
          i
        );
      }),
      (t.prototype.doFire = function(t, e, r, i) {
        if (
          i.types.includes(t) ||
          i.types.includes(exports.StoreEventType.All)
        ) {
          if (i instanceof StoreEventSpecificKeys) {
            var n = Object.keys(e).filter(function(t) {
              return !i.includeKeys.includes(t);
            });
            return void (
              areSimilar.apply(void 0, __spreadArrays([e, r], n)) ||
              i.onFire(e, r, i.includeKeys, t)
            );
          }
          i.onFire(e, r, t);
        }
      }),
      t
    );
  })(),
  Store = (function() {
    function t(t, e, r) {
      (this.persistenceDriver = r),
        (this.components = []),
        (this.eventManager = null),
        (this.initialState = null),
        (this.frozenState = null),
        (this.opts = {
          live: !1,
          freezeInstances: !1,
          immutable: !1,
          persistence: !1,
          setStateTimeout: 0,
          uniqKey: null
        }),
        this.checkInitialStateType(t);
      var i = null;
      if (
        (e &&
          ((this.opts.immutable = !0 === e.immutable),
          (this.opts.persistence = !0 === e.persistence),
          (this.opts.setStateTimeout = e.setStateTimeout),
          (this.opts.uniqKey = e.uniqKey)),
        (this.id = this.opts.uniqKey || this.generateStoreId(t)),
        this.persistenceDriver ||
          (this.persistenceDriver = new StorePersistentLocalStorageDriver(
            this.id
          )),
        this.opts.persistence)
      ) {
        var n = this.persistenceDriver.read().data;
        n && (i = n);
      }
      null === i && (i = t),
        (this.persistenceDriver.persistence = this.opts.persistence),
        (this.persistenceDriver.initialState = t),
        (this.eventManager = new StoreEventManager(this.opts.setStateTimeout)),
        (this.initialState = this.deepFreeze(t)),
        (this.frozenState = this.deepFreeze(i));
    }
    return (
      Object.defineProperty(t.prototype, "state", {
        get: function() {
          return this.frozenState;
        },
        enumerable: !0,
        configurable: !0
      }),
      (t.prototype.checkInitialStateType = function(t) {
        if (
          [
            "number",
            "boolean",
            "string",
            "undefined",
            "symbol",
            "bigint"
          ].includes(typeof t)
        )
          throw new Error(
            "InitialState must be an object, passed: " + typeof t
          );
        if (
          [Array, Function, Map, Promise].some(function(e) {
            return t instanceof e;
          })
        )
          throw new Error(
            "InitialState must be an object, passed: " + t.constructor.name
          );
      }),
      (t.prototype.deepFreeze = function(t) {
        if (this.opts.immutable) {
          var e = Object.getOwnPropertyNames(t);
          for (var r in e)
            if (e.hasOwnProperty(r)) {
              var i = t[e[r]];
              "object" == typeof i && null !== i && this.deepFreeze(i);
            }
          return Object.freeze(t);
        }
        return t;
      }),
      (t.prototype.hashCode = function(t) {
        for (var e = 0, r = 0; r < t.length; r++)
          e = (Math.imul(31, e) + t.charCodeAt(r)) | 0;
        return e.toString(16);
      }),
      (t.prototype.generateStoreId = function(t) {
        var e = "";
        for (var r in t) t.hasOwnProperty(r) && (e += r);
        return this.hashCode(e);
      }),
      (t.prototype.resetPersistence = function() {
        this.persistenceDriver.reset();
      }),
      (t.prototype.clearPersistence = function() {
        this.persistenceDriver.clear();
      }),
      (t.prototype.resetDumpHistory = function() {
        this.persistenceDriver.resetHistory(),
          this.eventManager.fire(
            exports.StoreEventType.DumpUpdate,
            this.frozenState,
            this.frozenState
          );
      }),
      (t.prototype.saveDump = function() {
        var t = this.persistenceDriver.saveDump(
          this.persistenceDriver.pack(this.frozenState)
        );
        return (
          this.eventManager.fire(
            exports.StoreEventType.DumpUpdate,
            this.frozenState,
            this.frozenState
          ),
          t
        );
      }),
      (t.prototype.removeDump = function(t) {
        this.persistenceDriver.removeDump(t),
          this.eventManager.fire(
            exports.StoreEventType.DumpUpdate,
            this.frozenState,
            this.frozenState
          );
      }),
      (t.prototype.restoreDump = function(t) {
        var e = this.persistenceDriver.readDump(t);
        if (e) {
          var r = this.deepFreeze(this.frozenState);
          this.setState(e.data),
            this.eventManager.fire(
              exports.StoreEventType.DumpUpdate,
              this.frozenState,
              r
            );
        }
      }),
      (t.prototype.getDumpHistory = function() {
        return this.persistenceDriver.getDumpHistory();
      }),
      (t.prototype.setState = function(t) {
        var e = this.deepFreeze(this.frozenState),
          r = this.deepFreeze(__assign(__assign({}, e), t));
        (this.frozenState = r),
          this.persistenceDriver.write(this.persistenceDriver.pack(r)),
          this.update(r, e);
      }),
      (t.prototype.resetState = function() {
        this.setState(this.deepFreeze(this.initialState));
      }),
      (t.prototype.update = function(t, e) {
        for (var r in this.components)
          this.components[r].isStoreMounted &&
            this.components.hasOwnProperty(r) &&
            (this.components[r].storeComponentStoreWillUpdate(),
            this.components[r].forceUpdate(),
            this.components[r].storeComponentStoreDidUpdate());
        this.eventManager.fire(exports.StoreEventType.Update, t, e);
      }),
      (t.prototype.getInitialState = function() {
        return this.initialState;
      }),
      (t.prototype.on = function(t, e, r) {
        var i,
          n = t && t.constructor === Array ? t : [t];
        return (
          (i = Array.isArray(e)
            ? this.eventManager.add(n, r, e)
            : this.eventManager.add(n, e)),
          this.eventManager.fire(
            exports.StoreEventType.Init,
            this.frozenState,
            this.frozenState,
            i
          ),
          this.eventManager.fire(
            exports.StoreEventType.DumpUpdate,
            this.frozenState,
            this.frozenState,
            i
          ),
          i
        );
      }),
      t
    );
  })();
function getOption(t) {
  var e = function(t) {
      return t;
    },
    r = function(t, e) {
      return t === e;
    },
    i = exports.StoreEventType.All,
    n = [];
  return t[0] &&
    (Object.keys(exports.StoreEventType).includes(t[0].toString()) ||
      (Array.isArray(t[0]) &&
        Object.keys(exports.StoreEventType).includes(t[0][0].toString())))
    ? {
        eventType: t[0],
        mapState: t[1] || e,
        compare: t[2] || r,
        includeKeys: n
      }
    : t[0] && Array.isArray(t[0]) && "string" == typeof t[0][0]
    ? { eventType: t[1] || i, mapState: e, compare: r, includeKeys: t[0] }
    : "function" == typeof t[0]
    ? { eventType: i, mapState: t[0] || e, compare: t[1] || r, includeKeys: n }
    : t[0]
    ? {
        eventType: t[0].eventType || i,
        mapState: t[0].mapState || e,
        compare: t[0].compare || r,
        includeKeys: n
      }
    : { mapState: e, compare: r, eventType: i, includeKeys: n };
}
function useStore(t) {
  for (var e = [], r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
  var i = React.useMemo(function() {
      return getOption(e);
    }, []),
    n = React.useMemo(function() {
      return i.mapState(t.state);
    }, []),
    o = React.useState(0),
    s = React.useRef(n);
  return (
    React.useEffect(function() {
      var e;
      return (
        (e =
          i.includeKeys.length > 0
            ? t.on(i.eventType, i.includeKeys, function(t) {
                (s.current = i.mapState(t)), o[1](Date.now());
              })
            : t.on(i.eventType, function(t, e, r) {
                var n = i.mapState(t, e, r);
                (i.compare && i.compare(n, s.current)) ||
                  ((s.current = n), o[1](Date.now()));
              })),
        function() {
          e.remove();
        }
      );
    }, []),
    s.current
  );
}
function useIsolatedStore(t, e, r) {
  var i = React__default.useState(0),
    n = React__default.useRef(
      new Store(t, __assign({ persistence: !1, immutable: !0 }, e), r)
    );
  return (
    React__default.useEffect(function() {
      var t = n.current.on(exports.StoreEventType.Update, function() {
        i[1](Date.now());
      });
      return function() {
        var r;
        t.remove(),
          (null === (r = e) || void 0 === r ? void 0 : r.persistence) ||
            n.current.resetState();
      };
    }, []),
    n.current
  );
}
(exports.Store = Store),
  (exports.StoreEvent = StoreEvent),
  (exports.StorePersistentDriver = StorePersistentDriver),
  (exports.StorePersistentLocalStorageDriver = StorePersistentLocalStorageDriver),
  (exports.areSimilar = areSimilar),
  (exports.followStore = followStore),
  (exports.useIsolatedStore = useIsolatedStore),
  (exports.useStore = useStore);
