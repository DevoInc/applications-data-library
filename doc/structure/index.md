# Structures

This section describes wich data structures is required for each widget.

## Animated heatmap

```javascript
[
  {
    period: eventdate,
    values: [[latitudes], [longitudes], [count]],
  },
  ...
];
```

## Availability timeline

```javascript
[
  {
    measure: key,
    data: [[datetime, value], ...],
    interval_s: groupingTime,
  },
  ...
];
```

## Bichord

```javascript
{
  source: [sourceColumn, ...],
  target: [targetColumn, ...],
  values: [valueColumn, ...],
  pct: [percetangeVal, ...],
  kKeys: {
    source: sourceKey,
    target: targetKey,
  },
  kval: {
    value:valueKey
    }
}
```

## Bubble

```javascript
{
  data: {
    allPeriods: [
      [xValue, ...],
      [yValue, ...],
      [value, ...],
      [seriesByValue, ...]
    ],
    byPeriod: [
      { period: '',
        values: allPeriods
      }
    ],
  },
  metadata: {fields: [
    { name: xAxisName, type: xAxisType},
    { name: yAxisName, type: yAxisType},
    { name: value, type: 'int'},
    { name: seriesBy, type: 'str'},
  ], realtime: false}
}
```

## Bullet

```javascript
{
  result:  [
    {
      title: title,
      ranges: [min, med, max],
      measures: [value],
      markers: [value]
    }
  ],
  longestTitle: title;
}
```

## Circle world map

```javascript
{
  lat: [latitude, ...],
  lon: [longitude, ...],
  val: [value, ...],
  kKeys: {
    lat: columnNameLat,
    long: columnNameLon,
  },
  kval: {
    value: columnNameValue
  }
};
```

## Column

See [Hicharts](https://www.highcharts.com/) documentation.

## Funnel

```javascript
[
  {
    name: name,
    val: value,
  },
];
```

## Gauge

```javascript
{
    avg: number,
    v: number,
    maximun: number,
    minimun: number,
}
```

## Google colormap

```javascript
{
  country: [countryName, ...],
  min: number,
  max: number,
  totalData: number,
  kKeys: {
    country: columnName},
  kval: {
    value: columnValue
  }
}
```

## Google heatmap

```javascript
{
  lat: [latitude, ...],
  lon: [longitude, ...],
  val: [value, ...],
  kKeys: {
    lat: columnNameLat,
    long: columnNameLon,
  },
  kval: {
    value: columnNameValue
  }
};
```

## Graph

```javascript
{
  metadata: {
    realtime: false,
    fields: [
      {
        name: name,
        role: 'date|node|linkWithDelta',
        type: type
      },
      ...
    ],
    graphModel: {
      linkWidthDeltaColumns: ['count']
    }
  },
  matrix: []
};
```

## Heat calendar

```javascript
{
    tags: [name, ...],
    days: [timestampValue, ...],
    values: [value, ...]
}
```

## Histogram

```javascript
{
    tags: [],
    days: [],
    values: []
}
```

## Lines

See [Hicharts](https://www.highcharts.com/) documentation.

## Monitoring

```javascript
[
  {
    sum: sum,
    total: total,
    min: min,,
    max: max,
  },
  ...
];
```

## Pew pew map

```javascript
{
    from: [lon, lat],
    to: [lon, lat],
    v: val,
    c: color,
    labels: [labelFrom, labelTo]
}
```

## Pie

See [Hicharts](https://www.highcharts.com/) documentation.

## Pie layered

See [Hicharts](https://www.highcharts.com/) documentation.

## Punchcard

```javascript
[
  {
    name: keyValue,
    articles: [
      [timestamp, value],
      ...
    ]
  },
  ...
];
```

## RAG

```javascript
[
  {
    name: key,
    val: number
  },
  ...
];
```

## Sankey

```javascript
{
  nodes: [],
  links: {
    source: [],
    target: [],
    value: [],
  }
}
```

## Stacked bars

See [Hicharts](https://www.highcharts.com/) documentation.

## Table

```javascript
{
  labels: [],
  name: [],
  count: [],
  pct: []
}
```

## Time heatmap

```javascript
[
  [timestamp, value],
  ...
];
```

## Tree

```javascript
{
  data: [],
  kKeys: {
    keys: keys
  },
  kval: {
    value: value
  }
}
```

## Voronoi

```javascript
{
  data: [returnData],
  kKeys: { keys: [] },
  kval: { value: [valKeys] },
  error: null
}
```
