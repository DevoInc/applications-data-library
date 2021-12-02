import { getRowByKey, checkData } from '../utils/dataUtils';
import loxcopeTypes from '../utils/loxcope/types';

export default (data, widget) => {
  let ret = {};
  let graphModel = widget.settings.graphmodel;
  if (checkData(data)) {
    if (widget.widget._filterSpecs) {
      ret = graphNew(data, graphModel.types, graphModel.nodes, graphModel.attrs,
        graphModel.linkWidthDeltaColumns, graphModel.fields);
    } else {
      ret = graph(data, graphModel.nodes, graphModel.links, graphModel.fields);
    }
  }
  return ret;
};

let now = new moment().format('YYYY-MM-DD HH:mm:ss.SSS');

function graphNew(data, types = [], nodes = [], attrs = [],
  linkWidthDeltaColumns = null, fields = []) {
  var ret = {
    metadata: {
      graphModel: {
        types: {},
        nodes: {},
        attrs: {},
        linkWidthDeltaColumns: ['count']
      },
      realtime: false,
      fields: []
    },
    matrix: []
  };
  let keys = [];
  /* Build types */
  let timeField = {
    name: 'eventdate',
    type: loxcopeTypes.Timestamp
  };
  ret.metadata.fields = ret.metadata.fields.concat(timeField);
  keys = keys.concat('eventdate');
  let metadata = ret.metadata;

  getTypes(types, metadata.graphModel);
  getNodes(nodes, metadata.graphModel, keys);
  getAttrs(attrs, metadata.graphModel, keys);
  getFields(fields, metadata);
  buildMatrix(data, keys, ret);
  return ret;
}

/* GRAPH */
function graph(data, nodes = [], links = [], fields = []) {
  var ret = {
    metadata: {
      realtime: false,
      fields: [],
      graphModel: {
        linkWidthDeltaColumns: ['count']
      }
    },
    matrix: []
  };

  var keys = [];
  /* Build types */
  var field = {
    name: 'eventdate',
    role: 'date',
    type: loxcopeTypes.Timestamp
  };
  ret.metadata.fields.push(field);
  keys.push('eventdate');

  nodes.forEach(function(node) {
    var field = {
      name: node.name,
      role: 'node',
      type: loxcopeTypes[node.type]
    };
    ret.metadata.fields.push(field);
    keys.push(node.name);
  });
  links.forEach(function(link) {
    var field = {
      name: link.name,
      role: 'linkWidthDelta',
      type: loxcopeTypes[link.type]
    };
    ret.metadata.fields.push(field);
    keys.push(link.name);
  });
  fields.forEach(function(field) {
    var fieldAux = {
      name: field.name,
      type: loxcopeTypes[field.type]
    };
    ret.metadata.fields.push(fieldAux);
  });

  /* Build data */
  buildMatrix(data, keys, ret);
  return ret;
}

function getTypes(types, model) {
  for (let type of types) {
    model.types[type.name] = {
      name: type.name,
      color: type.color,
      icon: type.icon,
      palette: type.palette
    };
  }
}

function getNodes(nodes, model, keys) {
  for (let node of nodes) {
    model.nodes[node.name] = {
      name: node.name,
      type: node.type,
      links: node.links ? node.links : null
    };
    keys.push(node.name);
  }
}

function getAttrs(attrs, model, keys) {
  for (let attr of attrs) {
    model.attrs[attr.name] = {
      name: attr.name,
      node: attr.node,
      role: attr.role
    };
    keys.push(attr.name);
  }
}

function getFields(fields, metadata) {
  for (let field of fields) {
    metadata.fields = metadata.fields.concat({
      name: field.name,
      type: loxcopeTypes[field.type]
    });
  }
}

function buildMatrix(data, keys, ret) {
  for (let key of keys) {
    let row = getRowByKey(data, key);
    if (row && row.length > 0) {
      let idx = data.keys.findIndex((el) => el.name === key);
      let graphKeyIndex = keys.indexOf(key);
      ret.matrix[graphKeyIndex] = [];
      for (let elem of data.dataMatrix) {
        ret.matrix[graphKeyIndex].push(elem[idx]);
      }
    } else {
      if (key === 'eventdate') {
        ret.matrix[0] = [];
        data.dataMatrix.forEach(() => ret.matrix[0].push(now));
      }
    }
  }
}
