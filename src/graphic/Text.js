import Element from './Element';
import * as dataUtil from '../core/utils/data_structure_util';
import * as textContain from '../core/contain/text';
import * as textUtil from './utils/text_util';
import {ContextCachedBy} from './constants';

/**
 * @class qrenderer.graphic.Text
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default class Text extends Element{
    /**
     * @method constructor Text
     * @param {Object} opts 
     */
    constructor(opts){
        super(opts);
        /**
         * @property {String} type
         */
        this.type='text';
    }

    brush(ctx, prevEl) {
        let style = this.style;

        // Optimize, avoid normalize every time.
        this.__dirty && textUtil.normalizeTextStyle(style, true);

        // Use props with prefix 'text'.
        style.fill = style.stroke = style.shadowBlur = style.shadowColor =
            style.shadowOffsetX = style.shadowOffsetY = null;

        let text = style.text;
        // Convert to string
        text != null && (text += '');

        // Do not apply style.bind in Text node. Because the real bind job
        // is in textUtil.renderText, and performance of text render should
        // be considered.
        // style.bind(ctx, this, prevEl);

        if (!textUtil.needDrawText(text, style)) {
            // The current el.style is not applied
            // and should not be used as cache.
            ctx.__attrCachedBy = ContextCachedBy.NONE;
            return;
        }

        this.setTransform(ctx);

        textUtil.renderText(this, ctx, text, style, null, prevEl);

        this.restoreTransform(ctx);
    }

    getBoundingRect() {
        let style = this.style;
        // Optimize, avoid normalize every time.
        this.__dirty && textUtil.normalizeTextStyle(style, true);
        if (!this._rect) {
            let text = style.text;
            text != null ? (text += '') : (text = '');
            let rect = textContain.getBoundingRect(
                style.text + '',
                style.font,
                style.textAlign,
                style.textVerticalAlign,
                style.textPadding,
                style.textLineHeight,
                style.rich
            );
            rect.x += style.x || 0;
            rect.y += style.y || 0;
            if (textUtil.getStroke(style.textStroke, style.textStrokeWidth)) {
                let w = style.textStrokeWidth;
                rect.x -= w / 2;
                rect.y -= w / 2;
                rect.width += w;
                rect.height += w;
            }
            this._rect = rect;
        }
        return this._rect;
    }
}