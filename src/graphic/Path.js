import Displayable from './Displayable';
import * as dataUtil from '../core/utils/dataStructureUtil';
import * as classUtil from '../core/utils/classUtil';
import PathProxy from '../core/PathProxy';
import * as pathContain from '../core/contain/path';
import Pattern from './Pattern';

/**
 * @class zrender.graphic.Path 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
class Path extends Displayable{
    /**
     * @method constructor Path
     * @param {Object} opts
     * @param {Object} defaultConfig
     */
    constructor(opts,defaultConfig){
        super(opts);
        /**
         * @property {PathProxy}
         * @readOnly
         */
        this.path = null;
        /**
         * @property {String} type
         */
        this.type='path';
        /**
         * @private
         * @property __dirtyPath
         */
        this.__dirtyPath=true;
        /**
         * @property {Number} strokeContainThreshold
         */
        this.strokeContainThreshold=5;
        /**
         * @property {Number} segmentIgnoreThreshold
         * This item default to be false. But in map series in echarts,
         * in order to improve performance, it should be set to true,
         * so the shorty segment won't draw.
         */
        this.segmentIgnoreThreshold=0;
    
        /**
         * @property {Boolean} subPixelOptimize
         * See `module:zrender/src/graphic/helper/subPixelOptimize`.
         */
        this.subPixelOptimize=false;

        //Path 特有的配置项
        if(defaultConfig){
            this.init(defaultConfig);
        }
    }

    init(defaultConfig){
        if (defaultConfig.style) {
            // Extend default style
            this.style.extendStyle(defaultConfig.style, false);
        }

        // Extend default shape
        let defaultShape = defaultConfig.shape;
        if (defaultShape) {
            this.shape = this.shape || {};
            for (let name in defaultShape) {
                if (!this.shape.hasOwnProperty(name)&&defaultShape.hasOwnProperty(name)){
                    this.shape[name] = defaultShape[name];
                }
            }
        }
        defaultConfig.init && defaultConfig.init.call(this, opts);

        // FIXME 不能 extend position, rotation 等引用对象
        // TODO:What's going on here?
        for (let name in defaultConfig) {
            // Extending prototype values and methods
            if (name !== 'style' && name !== 'shape') {
                Path.prototype[name] = defaultConfig[name];
            }
        }
    }

    /**
     * @method brush
     * @param {Object} ctx 
     * @param {Element} prevEl 
     */
    brush(ctx, prevEl) {
        let style = this.style;
        let path = this.path || new PathProxy(true);
        let hasStroke = style.hasStroke();
        let hasFill = style.hasFill();
        let fill = style.fill;
        let stroke = style.stroke;
        let hasFillGradient = hasFill && !!(fill.colorStops);
        let hasStrokeGradient = hasStroke && !!(stroke.colorStops);
        let hasFillPattern = hasFill && !!(fill.image);
        let hasStrokePattern = hasStroke && !!(stroke.image);

        style.bind(ctx, this, prevEl);
        this.setTransform(ctx);

        if (this.__dirty) {
            let rect;
            // Update gradient because bounding rect may changed
            if (hasFillGradient) {
                rect = rect || this.getBoundingRect();
                this._fillGradient = style.getGradient(ctx, fill, rect);
            }
            if (hasStrokeGradient) {
                rect = rect || this.getBoundingRect();
                this._strokeGradient = style.getGradient(ctx, stroke, rect);
            }
        }

        // Use the gradient or pattern
        if (hasFillGradient) {
            // PENDING If may have affect the state
            ctx.fillStyle = this._fillGradient;
        }else if (hasFillPattern) {
            ctx.fillStyle = Pattern.prototype.getCanvasPattern.call(fill, ctx);
        }

        if (hasStrokeGradient) {
            ctx.strokeStyle = this._strokeGradient;
        }else if (hasStrokePattern) {
            ctx.strokeStyle = Pattern.prototype.getCanvasPattern.call(stroke, ctx);
        }

        let lineDash = style.lineDash;
        let lineDashOffset = style.lineDashOffset;

        let ctxLineDash = !!ctx.setLineDash;

        // Update path sx, sy
        let scale = this.getGlobalScale();
        path.setScale(scale[0], scale[1], this.segmentIgnoreThreshold);

        // Proxy context
        // Rebuild path in following 2 cases
        // 1. Path is dirty
        // 2. Path needs javascript implemented lineDash stroking.
        //    In this case, lineDash information will not be saved in PathProxy
        if (this.__dirtyPath
            || (lineDash && !ctxLineDash && hasStroke)) {
            path.beginPath(ctx);
            // Setting line dash before build path
            if (lineDash && !ctxLineDash) {
                path.setLineDash(lineDash);
                path.setLineDashOffset(lineDashOffset);
            }
            this.buildPath(path, this.shape, false);
            // Clear path dirty flag
            if (this.path) {
                this.__dirtyPath = false;
            }
        }else {
            // Replay path building
            ctx.beginPath();
            this.path.rebuildPath(ctx);
        }

        if (hasFill) {
            if (style.fillOpacity != null) {
                let originalGlobalAlpha = ctx.globalAlpha;
                ctx.globalAlpha = style.fillOpacity * style.opacity;
                path.fill(ctx);
                ctx.globalAlpha = originalGlobalAlpha;
            }else {
                path.fill(ctx);
            }
        }

        if (lineDash && ctxLineDash) {
            ctx.setLineDash(lineDash);
            ctx.lineDashOffset = lineDashOffset;
        }

        if (hasStroke) {
            if (style.strokeOpacity != null) {
                let originalGlobalAlpha = ctx.globalAlpha;
                ctx.globalAlpha = style.strokeOpacity * style.opacity;
                path.stroke(ctx);
                ctx.globalAlpha = originalGlobalAlpha;
            }else {
                path.stroke(ctx);
            }
        }

        if (lineDash && ctxLineDash) {
            // PENDING
            // Remove lineDash
            ctx.setLineDash([]);
        }

        // Draw rect text
        if (style.text != null) {
            // Only restore transform when needs draw text.
            this.restoreTransform(ctx);
            this.drawRectText(ctx, this.getBoundingRect());
        }
    }

    /**
     * @method buildPath
     * 
     * Each subclass should provide its own implement for this method.
     * When build path, some shape may decide if use moveTo to begin a new subpath or closePath, like in circle.
     * 
     * 每个子类都需要为此方法提供自己的实现。
     * 在构建路径时，某些形状需要根据情况决定使用 moveTo 来开始一段子路径，或者直接用 closePath 来封闭路径，比如圆形。
     * 
     * @param {*} ctx 
     * @param {*} shapeCfg 
     * @param {*} inBundle 
     */
    buildPath(ctx, shapeCfg, inBundle) {}

    /**
     * @method createPathProxy
     */
    createPathProxy() {
        this.path = new PathProxy();
    }

    /**
     * @method getBoundingRect
     */
    getBoundingRect() {
        let rect = this._rect;
        let style = this.style;
        let needsUpdateRect = !rect;
        if (needsUpdateRect) {
            let path = this.path;
            if (!path) {
                // Create path on demand.
                path = this.path = new PathProxy();
            }
            if (this.__dirtyPath) {
                path.beginPath();
                this.buildPath(path, this.shape, false);
            }
            rect = path.getBoundingRect();
        }
        this._rect = rect;

        if (style.hasStroke()) {
            // Needs update rect with stroke lineWidth when
            // 1. Element changes scale or lineWidth
            // 2. Shape is changed
            let rectWithStroke = this._rectWithStroke || (this._rectWithStroke = rect.clone());
            if (this.__dirty || needsUpdateRect) {
                rectWithStroke.copy(rect);
                // FIXME Must after updateTransform
                let w = style.lineWidth;
                // PENDING, Min line width is needed when line is horizontal or vertical
                let lineScale = style.strokeNoScale ? this.getLineScale() : 1;

                // Only add extra hover lineWidth when there are no fill
                if (!style.hasFill()) {
                    w = Math.max(w, this.strokeContainThreshold || 4);
                }
                // Consider line width
                // Line scale can't be 0;
                if (lineScale > 1e-10) {
                    rectWithStroke.width += w / lineScale;
                    rectWithStroke.height += w / lineScale;
                    rectWithStroke.x -= w / lineScale / 2;
                    rectWithStroke.y -= w / lineScale / 2;
                }
            }

            // Return rect with stroke
            return rectWithStroke;
        }

        return rect;
    }

    /**
     * @method contain
     * @param {*} x 
     * @param {*} y 
     */
    contain(x, y) {
        let localPos = this.transformCoordToLocal(x, y);
        let rect = this.getBoundingRect();
        let style = this.style;
        x = localPos[0];
        y = localPos[1];

        if (rect.contain(x, y)) {
            let pathData = this.path.data;
            if (style.hasStroke()) {
                let lineWidth = style.lineWidth;
                let lineScale = style.strokeNoScale ? this.getLineScale() : 1;
                // Line scale can't be 0;
                if (lineScale > 1e-10) {
                    // Only add extra hover lineWidth when there are no fill
                    if (!style.hasFill()) {
                        lineWidth = Math.max(lineWidth, this.strokeContainThreshold);
                    }
                    if (pathContain.containStroke(
                        pathData, lineWidth / lineScale, x, y
                    )) {
                        return true;
                    }
                }
            }
            if (style.hasFill()) {
                return pathContain.contain(pathData, x, y);
            }
        }
        return false;
    }

    /**
     * @method dirty
     * @param  {Boolean} dirtyPath
     */
    dirty(dirtyPath) {
        if (dirtyPath == null) {
            dirtyPath = true;
        }
        // Only mark dirty, not mark clean
        if (dirtyPath) {
            this.__dirtyPath = dirtyPath;
            this._rect = null;
        }

        this.__dirty = this.__dirtyText = true;

        this.__zr && this.__zr.refresh();

        // Used as a clipping path
        if (this.__clipTarget) {
            this.__clipTarget.dirty();
        }
    }

    /**
     * @method animateShape
     * Alias for animate('shape')
     * @param {Boolean} loop
     */
    animateShape(loop) {
        return this.animate('shape', loop);
    }

    /**
     * @method attrKV
     * Overwrite attrKV
     * @param {*} key 
     * @param {Object} value 
     */
    attrKV(key, value) {
        // FIXME
        if (key === 'shape') {
            this.setShape(value);
            this.__dirtyPath = true;
            this._rect = null;
        }else {
            Displayable.prototype.attrKV.call(this, key, value);
        }
    }

    /**
     * @method setShape
     * @param {Object|String} key
     * @param {Object} value
     */
    setShape(key, value) {
        // Path from string may not have shape
        if(!this.shape){
            return this;
        }
        if (dataUtil.isObject(key)) {
            classUtil.copyOwnProperties(this.shape,key);
        }else {
            this.shape[key] = value;
        }
        this.dirty(true);
        return this;
    }

    /**
     * @method getLineScale
     */
    getLineScale() {
        let m = this.transform;
        // Get the line scale.
        // Determinant of `m` means how much the area is enlarged by the
        // transformation. So its square root can be used as a scale factor
        // for width.
        return m && Math.abs(m[0] - 1) > 1e-10 && Math.abs(m[3] - 1) > 1e-10
            ? Math.sqrt(Math.abs(m[0] * m[3] - m[2] * m[1]))
            : 1;
    }
}

export default Path;