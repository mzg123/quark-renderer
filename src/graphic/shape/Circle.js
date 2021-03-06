import Path from '../Path';
import * as dataUtil from '../../core/utils/data_structure_util';
import {PI2} from '../../graphic/constants';

/**
 * @class qrenderer.graphic.shape.Circle 
 * 圆形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
let defaultConfig={
    /**
     * @property {String} type
     */
    type: 'circle',
    shape: {
        cx: 0,
        cy: 0,
        r: 0
    }
}

export default class Circle extends Path{
    /**
     * @method constructor Rect
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
    buildPath(ctx, shape, inBundle) {
        // Better stroking in ShapeBundle
        // Always do it may have performence issue ( fill may be 2x more cost)
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }
        ctx.arc(shape.cx, shape.cy, shape.r, 0, PI2, true);
    }
}