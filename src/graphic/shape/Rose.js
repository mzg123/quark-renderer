import Path from '../Path';
import * as dataUtil from '../../core/utils/data_structure_util';
import {mathSin,mathCos} from '../../graphic/constants';

/**
 * @class qrenderer.graphic.shape.Rose 
 * 玫瑰线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let radian = Math.PI / 180;

let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'rose',
    shape: {
        cx: 0,
        cy: 0,
        r: [],
        k: 0,
        n: 1
    },
    style: {
        stroke: '#000',
        fill: null
    }
};

export default class Rose extends Path{
    /**
     * @method constructor Rose
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
        let x;
        let y;
        let R = shape.r;
        let r;
        let k = shape.k;
        let n = shape.n;

        let x0 = shape.cx;
        let y0 = shape.cy;

        ctx.moveTo(x0, y0);

        for (let i = 0, len = R.length; i < len; i++) {
            r = R[i];

            for (let j = 0; j <= 360 * n; j++) {
                x = r
                        * mathSin(k / n * j % 360 * radian)
                        * mathCos(j * radian)
                        + x0;
                y = r
                        * mathSin(k / n * j % 360 * radian)
                        * mathSin(j * radian)
                        + y0;
                ctx.lineTo(x, y);
            }
        }
    }
}