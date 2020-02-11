
import * as curve from '../utils/curveUtil';

/**
 * 三次贝塞尔曲线描边包含判断
 * @param  {Number}  x0
 * @param  {Number}  y0
 * @param  {Number}  x1
 * @param  {Number}  y1
 * @param  {Number}  x2
 * @param  {Number}  y2
 * @param  {Number}  x3
 * @param  {Number}  y3
 * @param  {Number}  lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {boolean}
 */
export function containStroke(x0, y0, x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
    if (lineWidth === 0) {
        return false;
    }
    var _l = lineWidth;
    // Quick reject
    if (
        (y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l)
        || (y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l)
        || (x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l)
        || (x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l)
    ) {
        return false;
    }
    var d = curve.cubicProjectPoint(
        x0, y0, x1, y1, x2, y2, x3, y3,
        x, y, null
    );
    return d <= _l / 2;
}