const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const SUFFIXES = [
  { duration: DAY, suffix: 'days' },
  { duration: HOUR, suffix: 'hours' },
  { duration: MINUTE, suffix: 'minutes' },
  { duration: SECOND, suffix: 'seconds' },
  { duration: MILLISECOND, suffix: '' }
];

class Duration {

  constructor(millis) {
    this._millis = millis;
    this.SUFFIXES = [
      { duration: DAY, suffix: 'days' },
      { duration: HOUR, suffix: 'hours' },
      { duration: MINUTE, suffix: 'minutes' },
      { duration: SECOND, suffix: 'seconds' },
      { duration: MILLISECOND, suffix: '' }
    ];
  }

  str(millis) {
    return this.toSuffixed(millis, 1);
  }

  toSuffixed(millis, verbosity) {
    var str = '', m = millis, i = 0;
    while (m > 0) {
      var suf = SUFFIXES[i];
      if (suf.duration <= m) {
        str += Math.floor(m/suf.duration) + suf.suffix.substring(0,verbosity);
        m = m % suf.duration;
      }
      i++;
    }
    return (str.length === 0) ? '0' : str;
  }
}


let types = {
  Bool: {
    rep(x) {
      return (x == null) ? 'null' : x.toString();
    }
  },
  Int: {
    rep(x) {
      return (x == null) ? 'null' : x.toString();
    }
  },
  Float: {
    rep(x) {
      return (x == null) ? 'null' : x.toString();
    }
  },
  Timestamp: {
    rep(x) {
      /* ISO 8601 format in local time (without timezone information) */
      if (x == null) return 'null';
      function pad(n) {
        var s = n.toString();
        return (s.length >= 2) ? s : ('0' + s);
      }
      function pad3(n) {
        var s = n.toString();
        return (s.length >= 3) ? s : ('00'.substring(s.length-1) + s);
      }
      var d = new Date(x);
      return (d.getFullYear()
              + '-' + pad(d.getMonth()+1)
              + '-' + pad(d.getDate())
              + ' ' + pad(d.getHours())
              + ':' + pad(d.getMinutes())
              + ':' + pad(d.getSeconds())
              + '.' + pad3(d.getMilliseconds()));
    }
  },
  Duration: {
    rep(x) {
      return (x == null) ? 'null' :
        (x >= 0) ? Duration.str(x) : '-' + Duration.str((-x));
    }
  },
  Ip: {
    rep: function(ip) {
      if (ip == null) return 'null';
      ip = ip & 0xFFFFFFFF;
      var str = (((ip >>> 24) & 0xFF)
                 + '.' + ((ip >>> 16) & 0xFF)
                 + '.' + ((ip >>> 8) & 0xFF)
                 + '.' + (ip & 0xFF));
      return str;
    }
  },
  Str: {
    rep(x) {
      return (x == null) ? 'null' : x.toString();
    }
  },
  DC: {
    rep(x) {
      return (x == null) ? 'null' : x.toString();
    }
  },
  SetName: {
    rep(x) {
      return x.toString();
    }
  },
  BoxarInt1: {
    rep(x) {
      return (x == null) ? 'null' : x.rep();
    }
  },
  Image: {
    rep(x) {
      return (x == null) ? 'null' : x;
    }
  },
  GeoCoord: {
    rep(x) {
      return (x === null) ? 'null' : x.rep();
    }
  },
  Mac: {
    rep(x) {
      return (x === null) ? 'null' : x;
    }
  },
  Packet: {
    rep(x) {
      return (x === null) ? 'null' : '[' + x + ']';
    }
  },
  ArrayInt: {
    rep(x) {
      return (x === null) ? 'null' : '[' + x + ']';
    }
  },
  ArrayFloat: {
    rep(x) {
      return (x === null) ? 'null' : '[' + x + ']';
    }
  }
};

// Type Alias
types['bool'] = types.Bool;
types['int'] = types['int4'] = types['integer'] = types['long'] =
  types['int8'] = types.Int;
types['double'] = types['float8'] = types['float'] = types['float4'] =
  types.Float;
types['timestamp'] = types.Timestamp;
types['duration'] = types.Duration;
types['ip'] = types['ip4'] = types['ipv4'] = types.Ip;
types['str'] = types['string'] = types.Str;
types['dc'] = types['dc(hllpp)'] = types.DC;
types['set(name)'] = types.SetName;
types['boxar(int1)'] = types.BoxarInt1;
types['image'] = types.Image;
types['geocoord'] = types.GeoCoord;
types['mac'] = types.Mac;
types['packet'] = types.Packet;
types['array(int)'] = types['array(int4)'] = types['array(int8)'] =
  types.ArrayInt;
types['array(float)'] = types['array(float4)'] = types['array(float8)'] =
  types.ArrayFloat;

export default types;
