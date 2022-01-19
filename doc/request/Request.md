# Request

This class allows to retrieve data by a request from a Devo account. It's is based on XHR objects, used to interact with servers.

The constructor of this class, set the initial values to create a new request. Some of this properties are:

| Property | Default | Information                                                        |
| -------- | ------- | ------------------------------------------------------------------ |
| method   | 'GET'   | The HTTP request method to use. Normally is `GET`                  |
| headers  | {}      | Object with addtional information about the resource to be fetched |
| url      |         | The URL request                                                    |
| debug    | false   | When is true, some messages are displayed in the console explorer  |
| query    |         | String with the query                                              |
| dates    |         | Object with timestamp period _from_ and _to_ to retrieve data      |
| template |         | String with the query and variables to be replaced                 |

**Syntax**

```javascript
leq req = new Request(options)
```

**Parameters**

`options`: Object with key and values to be set as initial values.

## Methods

- [setHeader](#setheader)
- [setMethod](#setmethod)
- [setURL](#seturl)
- [setDates](#setdates)
- [setQuery](#setquery)
- [abort](#abort)
- [fixDates](#fixdates)
- [subscribe](#subscribe)
- [trigger](#trigger)
- [call](#call)
- [refreshOntime](#refreshontime)
- [parseTemplate](#parsetemplate)

### setHeader

Appends or update a new value onto an existing header inside of headers request.

**Syntax**

```javascript
req.setHeader(key, val);
```

**Parameters**

`key`: a string with the name of the HTTP header you want to add.
`val`: a string with the value of the HTTP header you want to add.

### setMethod

Set the request method to indicate the action to be performed for a given resource. By default, its value es `GET`.

**Syntax**

```javascript
req.setMthod(method);
```

**Parameters**

`method`: One of HTTP methods allowed.

### setURL

Refers to a URL where the resource can be found.

**Syntax**

```javascript
req.setURL(url);
```

**Parameters**

`url`: Text string specifying the URL.

### setDates

Set the request dates and trigger or not the `change` event to call the Request.

**Syntax**

```javascript
req.setDates(dates, trigger);
```

**Parameters**

`dates`: Object with `from` and `to` timestamp values.
`trigger`: (Optional) Boolean to trigger the request change event. Default `true`.

### setQuery

Set the request query and trigger or not the `change` event to call the Request.

**Syntax**

```javascript
req.setQuery(query, trigger);
```

**Parameters**

`query`: Query string to set.
`trigger`: (Optional) Boolean to trigger the request change event. Default `true`.

### abort

Abort the request.

**Syntax**

```javascript
req.abort();
```

### fixDates

Set the default dates if not exists ones. Given a timestamp, set _from_ as the timestamp less 1d and _to_ equal to timestamp.

**Syntax**

```javascript
req.fixDates(ts);
```

**Parameters**

`ts`: timestamp to set dates.

### subscribe

Create or add a new subscription for a specific property. A suscription can have multiple functions to call when triggered.

**Syntax**

```javascript
req.subscribe(prop, func);
```

**Parameters**

`prop`: Property string name to subscribe.
`func`: Function to execute when the subscription is triggered.

### trigger

Trigger all suscribed fuctions to a property.

**Syntax**

```javascript
req.trigger(prop, params);
```

**Parameters**

`prop`: Property to trigger.
`params`: Parametres to pass to each function to call.

### call

Sends the request and return a promise

**Syntax**

```javascript
req.call(append);
```

**Parameters**

`append`: Object to append to the response.

**Returns**

A Promise with the completion or failure of the call and its resulting value.

### refreshOntime

Relaunch the query every interval of time updating the dates (_from_ and _to_) adding the interval to the previous values.

**Syntax**

```javascript
req.refreshOntime(interval);
```

**Parameters**

`interval`: Milliseconds to relaunch the request.

### parseTemplate

When a new Request is created instead of the `query` attribute, the `template` attribute can be defined with the query including some variables to be replaced.

This method is allowed only when `template` property is defined when an instance of Request is created.

In the following example, the `myMethod` needs to be replaced with a value.

```javascript
let myTemplate = `from demo.ecommerce.data where method="${myMethod}" group select count() as count`;
let req = new Request({ template: myTemplate });
```

**Syntax**

```javascript
req.parseTemplate(obj, trigger);
```

**Parameters**

`obj`: Object with all variables and values to be replaced.
`trigger`: (Optional) Boolean to trigger the request change event. Default `true`.

## Basic Example

```javascript
import Request from #TODO

let request = new Request({
  method: 'GET',
  headers: {},
  url: 'someurl'
});
```
