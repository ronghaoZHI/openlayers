/**
 * @module ol/geom/Point
 */
import {inherits} from '../util.js';
import {createOrUpdateFromCoordinate, containsXY} from '../extent.js';
import GeometryType from '../geom/GeometryType.js';
import SimpleGeometry from '../geom/SimpleGeometry.js';
import {deflateCoordinate} from '../geom/flat/deflate.js';
import {squaredDistance as squaredDx} from '../math.js';

/**
 * @classdesc
 * Point geometry.
 *
 * @constructor
 * @extends {module:ol/geom/SimpleGeometry}
 * @param {module:ol/coordinate~Coordinate} coordinates Coordinates.
 * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
 * @api
 */
class Point {
  constructor(coordinates, opt_layout) {
    SimpleGeometry.call(this);
    this.setCoordinates(coordinates, opt_layout);
  }

  /**
   * Make a complete copy of the geometry.
   * @return {!module:ol/geom/Point} Clone.
   * @override
   * @api
   */
  clone() {
    const point = new Point(this.flatCoordinates.slice(), this.layout);
    return point;
  }

  /**
   * @inheritDoc
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    const flatCoordinates = this.flatCoordinates;
    const squaredDistance = squaredDx(x, y, flatCoordinates[0], flatCoordinates[1]);
    if (squaredDistance < minSquaredDistance) {
      const stride = this.stride;
      for (let i = 0; i < stride; ++i) {
        closestPoint[i] = flatCoordinates[i];
      }
      closestPoint.length = stride;
      return squaredDistance;
    } else {
      return minSquaredDistance;
    }
  }

  /**
   * Return the coordinate of the point.
   * @return {module:ol/coordinate~Coordinate} Coordinates.
   * @override
   * @api
   */
  getCoordinates() {
    return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
  }

  /**
   * @inheritDoc
   */
  computeExtent(extent) {
    return createOrUpdateFromCoordinate(this.flatCoordinates, extent);
  }

  /**
   * @inheritDoc
   * @api
   */
  getType() {
    return GeometryType.POINT;
  }

  /**
   * @inheritDoc
   * @api
   */
  intersectsExtent(extent) {
    return containsXY(extent, this.flatCoordinates[0], this.flatCoordinates[1]);
  }

  /**
   * @inheritDoc
   * @api
   */
  setCoordinates(coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 0);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = deflateCoordinate(
      this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
}

inherits(Point, SimpleGeometry);


export default Point;
