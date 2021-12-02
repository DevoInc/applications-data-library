# RequestApiMock

This class extends from the Request class and it's prepared to do fake request and simulate the conection with the Devo Query API. For more information about our Devo Query API visit https://docs.devo.com.

This class is exclusive for testing purposes and simulates a normal request, but instead of asking to an API, you need to load a JSON object locally.

Additional to the Request class constructor, this class have some extra additional initial values to create a new request. Some of this properties are:

| Property | Default        | Information                                                                          |
| -------- | -------------- | ------------------------------------------------------------------------------------ |
| format   | 'json/compact' | The HTTP request method to use. It can be any allowed value from the Devo Query API. |
| delay    | 0              | Milliseconds that simulates response delay time                                      |

**Syntax**

```javascript
leq req = new RequestApiMock(options)
```

**Parameters**

`options`: Object with key and values to be set as initial values.

## Methods

- [setHeader](Request.md#setheader)
- [setMethod](Request.md#setmethod)
- [setURL](Request.md#seturl)
- [setDates](Request.md#setdates)
- [setQuery](Request.md#setquery)
- [abort](Request.md#abort)
- [fixDates](Request.md#fixdates)
- [subscribe](Request.md#subscribe)
- [trigger](Request.md#trigger)
- [call](Request.md#call)
- [refreshOntime](Request.md#refreshontime)
- [parseTemplate](Request.md#parsetemplate)

For more detail about methods of RequestAPI class show [Request](Request.md#methods)

## Basic Example

```javascript
import RequestApiMock from #TODO

let data = {
  m: {
    eventdate: { type: "timestamp", index: 0 },
    count: { type: "int8", index: 1 },
  },
  d: [
    [1551916800000, 21520],
    [1552003200000, 551753],
    [1552089600000, 552003],
    [1552176000000, 551988],
    [1552262400000, 551497],
    [1552348800000, 551307],
    [1552435200000, 551290],
    [1552521600000, 551193],
    [1552608000000, 551580]
  ],
};

let request = new RequestApiMock({
  results: data,
  delay: 1000
});
```
