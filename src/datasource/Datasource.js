'use strict';
/**
 * Clase que crea un objeto con los settings necesarios para crear un widget
 */

export default function Datasource(
  casperable,
  from,
  to,
  groupby,
  where,
  daterange,
  select,
  precision,
  sortDescending,
  limit,
  realtime
) {
  //Por si no se pone el 'new' forzamos a que se ponga
  if (!(this instanceof Datasource)) {
    return new Datasource(
      casperable,
      from,
      to,
      groupby,
      where,
      daterange,
      select,
      precision,
      sortDescending,
      limit,
      realtime
    );
  }
  if (
    typeof casperable !== 'undefined' &&
    casperable != null &&
    casperable != ''
  ) {
    this.settings = {
      ds: {},
    };
    this.setCasperable(casperable);
    this.setFrom(from);
    this.setTo(to);
    this.setGroupedBy(groupby);
    this.setWhere(where);
    this.setTimerange(daterange);
    this.setSelect(select);
    this.setPrecision(precision);
    this.setSortScaleUp(sortDescending);
    this.setLimit(limit);
    this.setRealtime(realtime);
  }
}

var _ = Datasource.prototype;

Datasource.TR_HOUR = 'hour';
Datasource.TR_SIXHOURS = 'sixhours';
Datasource.TR_HALFDAY = 'halfday';
Datasource.TR_DAY = 'day';
Datasource.TR_WEEK = 'week';
Datasource.TR_MONTH = 'month';
Datasource.TR_YEAR = 'year';

Datasource.GB_1MIN = 60000;
Datasource.GB_5MIN = 300000;
Datasource.GB_1HOUR = 3600000;
Datasource.GB_1DAY = 86400000;

/**
 * Clone the object
 * @returns {*}
 */
_.clone = function () {
  return new Datasource(
    this.getCasperable(),
    this.getFrom(),
    this.getTo(),
    this.getGroupedBy(),
    this.getWhere(),
    this.getTimerange(),
    this.getSelect(),
    this.getPrecision(),
    this.getSortScaleUp(),
    this.getLimit(),
    this.getRealtime()
  );
};

/**
 * Get Datasource casperable
 * @returns {casperable}
 */
_.getCasperable = function () {
  return this.settings.ds.casperable;
};

/**
 * Set datasource casperable
 * @param casperable
 * @returns {Datasource}
 */
_.setCasperable = function (casperable) {
  this.settings.ds.casperable = casperable;
  return this;
};

/**
 * Get casperable from
 * @returns {from}
 */
_.getFrom = function () {
  return this.settings.from;
};

/**
 * Set casperable from
 * @param from
 * @returns {Datasource}
 */
_.setFrom = function (from) {
  this.settings.from = from;
  return this;
};

/**
 * Get casperable to
 * @returns {to}
 */
_.getTo = function () {
  return this.settings.to;
};

/**
 * Set casperable to
 * @param to
 * @returns {Datasource}
 */
_.setTo = function (to) {
  this.settings.to = to;
  return this;
};

/**
 * Get Datasource groupedby
 * @returns {groupedby}
 */
_.getGroupedBy = function () {
  return this.settings.ds.groupedby;
};

/**
 * Set datasource groupedby
 * @param groupedby
 * @returns {Datasource}
 */
_.setGroupedBy = function (groupedby) {
  this.settings.ds.groupedby =
    typeof groupedby != 'undefined' && groupedby != null && groupedby != ''
      ? groupedby
      : Datasource.GB_5MIN;
  return this;
};

/**
 * Get Datasource where
 * @returns {where}
 */
_.getWhere = function () {
  return this.settings.ds.where;
};

/**
 * Set datasource where
 * @param where
 * @returns {Datasource}
 */
_.setWhere = function (where) {
  if (typeof where != 'undefined' && where != null) {
    this.settings.ds.where = where;
  } else {
    this.settings.ds.where = [];
  }
  return this;
};

/**
 * Get Datasource timerange
 * @returns {timerange}
 */
_.getTimerange = function () {
  return this.settings.ds.timerange;
};

/**
 * Set datasource timerange
 * @param timerange
 * @returns {Datasource}
 */
_.setTimerange = function (timerange) {
  this.settings.ds.timerange =
    typeof timerange != 'undefined' && timerange != null && timerange != ''
      ? timerange
      : Datasource.TR_DAY;
  return this;
};

/**
 * Get Datasource select
 * @returns {select}
 */
_.getSelect = function () {
  return this.settings.ds.select;
};

/**
 * Set datasource select
 * @param select
 * @returns {Datasource}
 */
_.setSelect = function (select) {
  if (typeof select != 'undefined' && select != null) {
    this.settings.ds.select = select;
  } else {
    this.settings.ds.select = { count: null };
  }
  return this;
};

/**
 * Get Datasource precision
 * @returns {precision}
 */
_.getPrecision = function () {
  return this.settings.ds.precision;
};

/**
 * Set datasource precision
 * @param precision
 * @returns {Datasource}
 */
_.setPrecision = function (precision) {
  this.settings.ds.precision = precision;
  return this;
};

/**
 * Get Datasource isScaleUp
 * @returns {isScaleUp}
 */
_.getSortScaleUp = function () {
  return this.settings.ds.isScaleUp;
};

/**
 * Set datasource isScaleUp
 * @param isScaleUp
 * @returns {Datasource}
 */
_.setSortScaleUp = function (isScaleUp) {
  this.settings.ds.isScaleUp = isScaleUp;
  return this;
};

/**
 * Get Datasource limit
 * @returns {limit}
 */
_.getLimit = function () {
  return this.settings.ds.maxElements;
};

/**
 * Set datasource limit
 * @param limit
 * @returns {Datasource}
 */
_.setLimit = function (maxElements) {
  this.settings.ds.maxElements = maxElements;
  return this;
};

/**
 * Get realtime
 * @returns {DashBoardWidget.defaults.realtime|*}
 */
_.getRealtime = function () {
  return this.settings.realtime;
};

/**
 * Set realtime
 * @param realtime
 * @returns {*}
 */
_.setRealtime = function (realtime) {
  this.settings.realtime = realtime;
  return this;
};
