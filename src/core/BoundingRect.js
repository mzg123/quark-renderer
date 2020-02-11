/**
 * @class zrender.core.BoundingRect
 */
import * as vec2 from './utils/vector';
import * as matrix from './utils/matrix';

let v2ApplyTransform = vec2.applyTransform;
let mathMin = Math.min;
let mathMax = Math.max;

/**
 * @method constructor BoundingRect
 */
function BoundingRect(x, y, width, height) {
    if (width < 0) {
        x = x + width;
        width = -width;
    }
    if (height < 0) {
        y = y + height;
        height = -height;
    }

    /**
     * @property {Number}
     */
    this.x = x;
    /**
     * @property {Number}
     */
    this.y = y;
    /**
     * @property {Number}
     */
    this.width = width;
    /**
     * @property {Number}
     */
    this.height = height;
}

BoundingRect.prototype = {

    constructor: BoundingRect,

    /**
     * @method union
     * @param {BoundingRect} other
     */
    union: function (other) {
        let x = mathMin(other.x, this.x);
        let y = mathMin(other.y, this.y);

        this.width = mathMax(
                other.x + other.width,
                this.x + this.width
            ) - x;
        this.height = mathMax(
                other.y + other.height,
                this.y + this.height
            ) - y;
        this.x = x;
        this.y = y;
    },

    /**
     * @method applyTransform
     * @param {Array<Number>}
     */
    applyTransform: (function () {
        let lt = [];
        let rb = [];
        let lb = [];
        let rt = [];
        return function (m) {
            // In case usage like this
            // el.getBoundingRect().applyTransform(el.transform)
            // And element has no transform
            if (!m) {
                return;
            }
            lt[0] = lb[0] = this.x;
            lt[1] = rt[1] = this.y;
            rb[0] = rt[0] = this.x + this.width;
            rb[1] = lb[1] = this.y + this.height;

            v2ApplyTransform(lt, lt, m);
            v2ApplyTransform(rb, rb, m);
            v2ApplyTransform(lb, lb, m);
            v2ApplyTransform(rt, rt, m);

            this.x = mathMin(lt[0], rb[0], lb[0], rt[0]);
            this.y = mathMin(lt[1], rb[1], lb[1], rt[1]);
            let maxX = mathMax(lt[0], rb[0], lb[0], rt[0]);
            let maxY = mathMax(lt[1], rb[1], lb[1], rt[1]);
            this.width = maxX - this.x;
            this.height = maxY - this.y;
        };
    })(),

    /**
     * @method calculateTransform
     * Calculate matrix of transforming from self to target rect
     * @param  {BoundingRect} b
     * @return {Array<Number>}
     */
    calculateTransform: function (b) {
        let a = this;
        let sx = b.width / a.width;
        let sy = b.height / a.height;

        let m = matrix.create();

        // 矩阵右乘
        matrix.translate(m, m, [-a.x, -a.y]);
        matrix.scale(m, m, [sx, sy]);
        matrix.translate(m, m, [b.x, b.y]);

        return m;
    },

    /**
     * @method intersect
     * @param {(BoundingRect|Object)} b
     * @return {boolean}
     */
    intersect: function (b) {
        if (!b) {
            return false;
        }

        if (!(b instanceof BoundingRect)) {
            // Normalize negative width/height.
            b = BoundingRect.create(b);
        }

        let a = this;
        let ax0 = a.x;
        let ax1 = a.x + a.width;
        let ay0 = a.y;
        let ay1 = a.y + a.height;

        let bx0 = b.x;
        let bx1 = b.x + b.width;
        let by0 = b.y;
        let by1 = b.y + b.height;

        return !(ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
    },

    /**
     * @method contain
     * @param {*} x 
     * @param {*} y 
     */
    contain: function (x, y) {
        let rect = this;
        return x >= rect.x
            && x <= (rect.x + rect.width)
            && y >= rect.y
            && y <= (rect.y + rect.height);
    },

    /**
     * @method clone
     * @return {BoundingRect}
     */
    clone: function () {
        return new BoundingRect(this.x, this.y, this.width, this.height);
    },

    /**
     * @method copy
     * Copy from another rect
     * @param other
     */
    copy: function (other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    },

    /**
     * @method plain
     */
    plain: function () {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
};

/**
 * @param {Object|BoundingRect} rect
 * @param {Number} rect.x
 * @param {Number} rect.y
 * @param {Number} rect.width
 * @param {Number} rect.height
 * @return {BoundingRect}
 */
BoundingRect.create = function (rect) {
    return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
};

export default BoundingRect;