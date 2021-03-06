import Path from '../Path';
import * as dataUtil from '../../core/utils/data_structure_util';
import {PI,mathSin,mathCos} from '../../graphic/constants';

/**
 * @class qrenderer.graphic.shape.Isogon 
 * 正多边形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'isogon',
    shape: {
        x: 0, y: 0,
        r: 0, n: 0
    }
};

export default class Isogon extends Path{
    /**
     * @method constructor Isogon
     * @param {Object} options 
     */
    constructor(options){
        super(dataUtil.merge(defaultConfig,options,true));
    }

    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */
    buildPath(ctx, shape) {
        let n = shape.n;
        if (!n || n < 2) {
            return;
        }

        let x = shape.x;
        let y = shape.y;
        let r = shape.r;

        let dStep = 2 * PI / n;
        let deg = -PI / 2;

        ctx.moveTo(x + r * mathCos(deg), y + r * mathSin(deg));
        for (let i = 0, end = n - 1; i < end; i++) {
            deg += dStep;
            ctx.lineTo(x + r * mathCos(deg), y + r * mathSin(deg));
        }

        ctx.closePath();

        return;
    }
}