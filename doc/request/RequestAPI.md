# RequestAPI

This class extends from the Request class and it's prepared to do request to our Devo Query API. For more information about our Devo Query API visit https://docs.devo.com.

Additional to the Request class constructor, this class have some extra additional initial values to create a new request. Some of this properties are:

| Property    | Default        | Information                                                                                          |
| ----------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| format      | 'json/compact' | The HTTP request method to use. It can be any allowed value from the Devo Query API.                 |
| autoRefresh | 0              | Value in milliseconds use to update the query. This value call refreshOntime method of Request class |

**Syntax**

```javascript
leq req = new RequestAPI(options)
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
import Request from #TODO

let request = new RequestApi({
  query: 'from demo.ecommerce.data select *',
  dates: {
    from: moment('01/01/1970').valueOf(),
    to: moment('02/01/1970').valueOf()
  }
});
```
