# RequestChain

This class allows to apply a sequencial chain of requests and functions. Each request will be executed sequencially, intermediate functions can be configure so that the results of one request can be adapted to parameterize the next request.

This class allows to retrieve data by a request from a Devo account. It's is based on XHR objects, used to interact with servers.

**Syntax**

```javascript
leq reqs = new RequestChain(chainUnits);
```

**Parameters**

`chainUnits`: Array with a mix of functions and Request object that will be executed sequenctially. Each query on Request object should be declarated as a template.

## Methods

- [parseTemplate](#parsetemplate)
- [setDates](#setdates)
- [getSearch](#getSearch)
- [abort](#abort)
- [subscribe](#subscribe)
- [trigger](#trigger)
- [call](#call)

### parseTemplate

Replace the template and apply on query. This will parametierize the first request.

For more info about parseTemplate method of Request, [click here](Request.md#parsetemplate)

**Syntax**

```javascript
reqs.parseTemplate(obj, trigger);
```

**Parameters**

`obj`: Object with all variables and values to be replaced.
`trigger`: (Optional) Boolean to trigger the request change event. Default `true`.

### setDates

Set the request dates for every Request object and trigger or not the `change` event to call the RequestChain.

**Syntax**

```javascript
reqs.setDates(dates, trigger);
```

**Parameters**

`dates`: Object with `from` and `to` timestamp values.
`trigger`: (Optional) Boolean to trigger the request change event. Default `true`.

### getSearch

Get the query of the first Request object contained in _chainUnits_.

**Syntax**

```javascript
reqs.getSearch();
```

**Returns**

A string with the query of the first Request object.

### abort

Abort the request.

**Syntax**

```javascript
reqs.abort();
```

### subscribe

Create or add a new subscription for a specific property. A suscription can have multiple functions to call when triggered.

**Syntax**

```javascript
reqs.subscribe(prop, func);
```

**Parameters**

`prop`: Property string name to subscribe.
`func`: Function to execute when the subscription is triggered.

### trigger

Trigger all suscribed fuctions to a property.

**Syntax**

```javascript
reqs.trigger(prop, params);
```

**Parameters**

`prop`: Property to trigger.
`params`: Parametres to pass to each function to call.

### call

Call the execution of each Request and funcitons contained in _chainUnits_ recursively.

**Syntax**

```javascript
reqs.call();
```
