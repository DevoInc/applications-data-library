# RequestCustom

This class extends from the Request class and it's prepared to do external request from Devo. The requestCustom wraps a custom call into the framework lifecycle, but the actual call must be implemented by the user.

This class is useful when the application needs external data.

RequestCustom gets just one parameter, which is the actual external call. This function must accept a callback argument in order to be able to handle the response. The raw result will be then wrapped in an object under object name and won't be processed by the framework. Any formatting function needed to draw the widgets must be implemented by the user.

| Property | Default | Information           |
| -------- | ------- | --------------------- |
| callFn   |         | Function to be called |
|          |

By default, widgets expect data to come in the following format:

```json
  {
    "m": {
      "field1": {"type":"timestamp","index":0},
      "field2":{"type":"int8","index":1}
      ...
    },
    "d":[
      [valueField1, valueField2],
      [valueField1, valueField2],
      [valueField1, valueField2],
      [valueField1, valueField2],
      ...
    ]
  }
```

**Syntax**

```javascript
leq req = new RequestCustom(options);
```

**Parameters**

`options`: Object with key and values to be set as initial values.

## Methods

Although this class extends from Request class not all methods might make sense to call them in this class

For more detail about methods of RequestAPI class show [Request](Request.md#methods)

## Basic Example

```javascript
import RequestCustom from #TODO

function apiCall (cb) {
  $.ajax({
    url: "https://somebigdataplatformnotascoolasdevo/api/resource",
    type: "POST",
    data: {
      token: "1234567890SuperSecure"
    },
    success: cb
  });
}

let request = new RequestCustom({
  callFn: apiCall
});
```
