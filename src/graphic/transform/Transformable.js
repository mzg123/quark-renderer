import {mathSqrt,mathAtan2} from '../constants';
import * as matrixUtil from '../../core/utils/matrix_util';
import * as vectorUtil from '../../core/utils/vector_util';
import * as classUtil from '../../core/utils/class_util';
import * as dataUtil from '../../core/utils/data_structure_util';

/**
 * @abstract
 * @class qrenderer.graphic.Transformable
 * 
 * Provide geometric transformation functions for Element, such as position, scale, skew, rotation.
 * 
 * 为 Element 提供几何变换功能，例如：平移、缩放、扭曲、旋转、翻转。
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations
 * @author pissang (https://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

let scaleTmp = [];
let transformTmp = [];

/**
 * @method constructor Transformable
 */
let Transformable = function (options={}) {
    /**
     * @property {Array<Number>} origin
     * 几何变换的原点，默认为最左上角的(0,0)点。
     */
    this.origin = (options.origin===null||options.origin===undefined)?[0, 0]:options.origin;

    /**
     * @property {Array<Number>} rotation
     * 旋转角度。
     */
    this.rotation = (options.rotation===null||options.rotation===undefined)?0:options.rotation;

    /**
     * @property {Array<Number>} position
     * 平移，二维数组。
     */
    this.position = (options.position===null||options.position===undefined)?[0, 0]:options.position;
    
    /**
     * @property {Array<Number>} scale
     * 缩放，二维数组。
     */
    this.scale = (options.scale===null||options.scale===undefined)?[1, 1]:options.scale;

    /**
     * @property {Array<Number>} skew
     * 扭曲，二维数组。
     */
    this.skew = (options.skew===null||options.skew===undefined)?[1, 1]:options.skew;

    /**
     * @property {Matrix} transform
     * 变换矩阵。
     */
    this.transform=null;

    /**
     * @property {Matrix} inverseTransform
     * 逆变换矩阵。
     */
    this.inverseTransform=null;

    //全局缩放比例
    this.globalScaleRatio=1;
};

Transformable.prototype={
    constructor:Transformable,

    /**
     * @method setRotation
     * 设置旋转角度。
     * @param {Number} rotation 角度
     */
    setRotation:function(rotation=0){
        this.rotation=rotation;
    },

    /**
     * @method setOrigin
     * 设置变换原点。
     * @param {Array<Number>} origin 二维数组
     */
    setOrigin:function(origin=[0,0]){
        this.origin=origin;
    },

    /**
     * @method setOriginX
     * 单独设置 X 轴原点。
     * @param {Number} originX 数值
     */
    setOriginX:function(originX=0){
        this.origin[0]=originX;
    },

    /**
     * @method setOriginY
     * 单独设置 Y 轴原点。
     * @param {Number} originY 数值
     */
    setOriginY:function(originY=0){
        this.origin[1]=originY;
    },

    /**
     * @method setPosition
     * 设置位置。
     * @param {Array<Number>} position 二维数组
     */
    setPosition:function(position=[0,0]){
        this.position=position;
    },

    /**
     * @method setX
     * 单独设置 X 轴位置。
     * @param {Number} x 数值
     */
    setX:function(x=0){
        this.position[0]=x;
    },

    /**
     * @method setY
     * 单独设置 Y 轴位置。
     * @param {Number} y 数值
     */
    setY:function(y){
        this.position[1]=y;
    },

    /**
     * @method setScale
     * 设置缩放。
     * @param {Array<Number>} scale 二维数组
     */
    setScale:function(scale=[1,1]){
        this.scale=scale;
    },

    /**
     * @method setScaleX
     * 单独设置 X 轴方向上的缩放。
     * @param {Number} scaleX 数值
     */
    setScaleX:function(scaleX=1){
        this.scale[0]=scaleX;
    },

    /**
     * @method setScaleY
     * 单独设置 Y 轴方向上的缩放。
     * @param {Number} scaleY 数值
     */
    setScaleY:function(scaleY=1){
        this.scale[1]=scaleY;
    },

    /**
     * @method setSkew
     * 设置扭曲。
     * @param {Array<Number>} skew 二维数组
     */
    setSkew:function(skew=[1,1]){
        this.skew=skew;
    },

    /**
     * @method setSkewX
     * 单独设置 X 轴方向上的扭曲。
     * @param {Number} skewX 数值
     */
    setSkewX:function(skewX){
        this.skew[0]=skewX;
    },

    /**
     * @method setSkewY
     * 单独设置 Y 轴方向上的扭曲。
     * @param {Number} skewY 数值
     */
    setSkewY:function(skewY){
        this.skew[1]=skewY;
    },

    /**
     * @method needLocalTransform
     * 判断是否需要有坐标变换，如果有坐标变换, 则从 position, rotation, scale, skew 以及父节点的 transform 计算出自身的 transform 矩阵
     * @return {Boolean}
     */
    needLocalTransform:function () {
        return dataUtil.isNotAroundZero(this.rotation)
            || dataUtil.isNotAroundZero(this.position[0])
            || dataUtil.isNotAroundZero(this.position[1])
            || dataUtil.isNotAroundZero(this.scale[0] - 1)
            || dataUtil.isNotAroundZero(this.scale[1] - 1)
            || dataUtil.isNotAroundZero(this.skew[0] - 1)
            || dataUtil.isNotAroundZero(this.skew[1] - 1);
    },

    /**
     * @method updateTransform
     * 更新变换矩阵。
     */
    updateTransform:function () {
        let parent = this.parent;
        let parentHasTransform = parent && parent.transform;
        let needLocalTransform = this.needLocalTransform();

        let m = this.transform || matrixUtil.create();

        // 自身的变换
        if (needLocalTransform) {
            this.getLocalTransform(m);
        }else {
            matrixUtil.identity(m);
        }

        // 应用父节点变换
        if (parentHasTransform) {
            if (needLocalTransform) {
                matrixUtil.mul(m, parent.transform, m);
            }else {
                matrixUtil.copy(m, parent.transform);
            }
        }

        if (this.globalScaleRatio != null && this.globalScaleRatio !== 1) {
            this.getGlobalScale(scaleTmp);
            let relX = scaleTmp[0] < 0 ? -1 : 1;
            let relY = scaleTmp[1] < 0 ? -1 : 1;
            let sx = ((scaleTmp[0] - relX) * this.globalScaleRatio + relX) / scaleTmp[0] || 0;
            let sy = ((scaleTmp[1] - relY) * this.globalScaleRatio + relY) / scaleTmp[1] || 0;
            
            m[0] *= sx;
            m[1] *= sx;
            m[2] *= sy;
            m[3] *= sy;
        }
        
        //保存变换矩阵
        this.transform = m;
        //计算逆变换矩阵
        this.inverseTransform = this.inverseTransform || matrixUtil.create();
        this.inverseTransform = matrixUtil.invert(this.inverseTransform, m);
    },

    /**
     * @method getLocalTransform
     * 获取本地变换矩阵。
     * @param {*} m 
     */
    getLocalTransform:function (m=[]) {
        matrixUtil.identity(m);

        let origin = this.origin || [0,0];
        let rotation = this.rotation || 0;
        let position = this.position || [0,0];
        let scale = this.scale || [1,1];
    
        if (origin) {
            // Translate to origin
            m[4] -= origin[0];
            m[5] -= origin[1];
        }
        
        matrixUtil.scale(m, m, scale);
        if (rotation) {
            matrixUtil.rotate(m, m, rotation);
        }

        if (origin) {
            // Translate back from origin
            m[4] += origin[0];
            m[5] += origin[1];
        }
    
        m[4] += position[0];
        m[5] += position[1];

        return m;
    },

    /**
     * @method setLocalTransform
     * 设置本地变换矩阵。
     * @param {*} m 
     */
    setLocalTransform:function (m) {
        if (!m) {
            // TODO return or set identity?
            return;
        }
        
        let sx = m[0] * m[0] + m[1] * m[1];
        let sy = m[2] * m[2] + m[3] * m[3];
        if (dataUtil.isNotAroundZero(sx - 1)) {
            sx = mathSqrt(sx);
        }
        if (dataUtil.isNotAroundZero(sy - 1)) {
            sy = mathSqrt(sy);
        }
        //why?
        if (m[0] < 0) {
            sx = -sx;
        }
        if (m[3] < 0) {
            sy = -sy;
        }

        this.rotation = mathAtan2(-m[1] / sy, m[0] / sx);
        this.position[0] = m[4];
        this.position[1] = m[5];
        this.scale[0] = sx;
        this.scale[1] = sy;
        this.skew[0]=m[1];
        this.skew[1]=m[2];
    },

    /**
     * @method setTransform
     * 
     * Apply the transform matrix to context.
     * 
     * 将自己的transform应用到context上。
     * 
     * @param {CanvasRenderingContext2D} ctx
     */
    setTransform:function (ctx) {
        let m = this.transform;
        let dpr = ctx.dpr || 1;
        if (m) {
            ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
        }else {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    },

    /**
     * @method restoreTransform
     * 重置变换矩阵。
     * @param {Context} ctx 
     */
    restoreTransform:function (ctx) {
        let dpr = ctx.dpr || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    /**
     * @method decomposeTransform
     * 分解`transform`矩阵到`position`, `scale`, `skew`。
     */
    decomposeTransform:function () {
        if (!this.transform) {
            return;
        }
        let parent = this.parent;
        let m = this.transform;
        if (parent && parent.transform) {
            // Get local transform and decompose them to position, scale, rotation
            matrixUtil.mul(transformTmp, parent.inverseTransform, m);
            m = transformTmp;
        }

        let origin = this.origin;
        let originTransform = matrixUtil.create();
        if (origin && (origin[0] || origin[1])) {
            originTransform[4] = origin[0];
            originTransform[5] = origin[1];
            matrixUtil.mul(transformTmp, m, originTransform);
            transformTmp[4] -= origin[0];
            transformTmp[5] -= origin[1];
            m = transformTmp;
        }

        this.setLocalTransform(m);
    },

    /**
     * @method getGlobalScale
     * Get global scale
     * @return {Array<Number>}
     */
    getGlobalScale:function (out=[]) {
        let m = this.transform;
        if (!m) {
            out[0] = 1;
            out[1] = 1;
            return out;
        }
        out[0] = mathSqrt(m[0] * m[0] + m[1] * m[1]);
        out[1] = mathSqrt(m[2] * m[2] + m[3] * m[3]);
        if (m[0] < 0) {
            out[0] = -out[0];
        }
        if (m[3] < 0) {
            out[1] = -out[1];
        }
        return out;
    },

    /**
     * @method globalToLocal
     * 变换坐标位置到 shape 的局部坐标空间。
     * @param {Number} x
     * @param {Number} y
     * @return {Array<Number>}
     */
    globalToLocal:function (x, y) {
        let v2 = [x, y];
        let inverseTransform = this.inverseTransform;
        if (inverseTransform) {
            vectorUtil.applyTransform(v2, v2, inverseTransform);
        }
        return v2;
    },

    /**
     * @method localToGlobal
     * 变换局部坐标位置到全局坐标空间
     * @param {Number} x
     * @param {Number} y
     * @return {Array<Number>}
     */
    localToGlobal:function (x, y) {
        let v2 = [x, y];
        let transform = this.transform;
        if (transform) {
            vectorUtil.applyTransform(v2, v2, transform);
        }
        return v2;
    }
}

export default Transformable;