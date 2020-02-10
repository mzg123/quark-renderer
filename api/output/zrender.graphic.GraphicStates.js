Ext.data.JsonP.zrender_graphic_GraphicStates({"tagname":"class","name":"zrender.graphic.GraphicStates","autodetected":{},"files":[{"filename":"States.js","href":"States.html#zrender-graphic-GraphicStates"}],"docauthor":[{"tagname":"docauthor","name":"大漠穷秋","email":"damoqiongqiu@126.com"}],"members":[{"name":"_currentState","tagname":"property","owner":"zrender.graphic.GraphicStates","id":"property-_currentState","meta":{"private":true}},{"name":"_el","tagname":"property","owner":"zrender.graphic.GraphicStates","id":"property-_el","meta":{}},{"name":"_initialState","tagname":"property","owner":"zrender.graphic.GraphicStates","id":"property-_initialState","meta":{"private":true}},{"name":"delay","tagname":"property","owner":"zrender.graphic.GraphicStates","id":"property-delay","meta":{}},{"name":"duration","tagname":"property","owner":"zrender.graphic.GraphicStates","id":"property-duration","meta":{}},{"name":"easing","tagname":"property","owner":"zrender.graphic.GraphicStates","id":"property-easing","meta":{}},{"name":"property","tagname":"property","owner":"zrender.graphic.GraphicStates","id":"property-property","meta":{}},{"name":"zlevel","tagname":"property","owner":"zrender.graphic.GraphicStates","id":"property-zlevel","meta":{}},{"name":"_animProp","tagname":"method","owner":"zrender.graphic.GraphicStates","id":"method-_animProp","meta":{"private":true}}],"alternateClassNames":[],"aliases":{},"id":"class-zrender.graphic.GraphicStates","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/States.html#zrender-graphic-GraphicStates' target='_blank'>States.js</a></div></pre><div class='doc-contents'><p>States machine for managing graphic states</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-_currentState' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-property-_currentState' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-property-_currentState' class='name expandable'>_currentState</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Current state ...</div><div class='long'><p>Current state</p>\n<p>Defaults to: <code>&#39;&#39;</code></p></div></div></div><div id='property-_el' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-property-_el' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-property-_el' class='name expandable'>_el</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-_initialState' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-property-_initialState' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-property-_initialState' class='name expandable'>_initialState</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>All other state will be extended from initial state ...</div><div class='long'><p>All other state will be extended from initial state</p>\n<p>Defaults to: <code>&#39;normal&#39;</code></p></div></div></div><div id='property-delay' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-property-delay' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-property-delay' class='name expandable'>delay</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='property-duration' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-property-duration' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-property-duration' class='name expandable'>duration</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>@default 'number' ...</div><div class='long'><p>@default 'number'</p>\n<p>Defaults to: <code>500</code></p></div></div></div><div id='property-easing' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-property-easing' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-property-easing' class='name expandable'>easing</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>@default 'Linear' ...</div><div class='long'><p>@default 'Linear'</p>\n<p>Defaults to: <code>&#39;Linear&#39;</code></p></div></div></div><div id='property-property' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-property-property' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-property-property' class='name expandable'>property</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>List of all transition properties. ...</div><div class='long'><p>List of all transition properties. Splitted by comma. Must not have spaces in the string.\ne.g. 'position,style.color'. '*' will match all the valid properties.@default *</p>\n<p>Defaults to: <code>&#39;*&#39;</code></p></div></div></div><div id='property-zlevel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-property-zlevel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-property-zlevel' class='name expandable'>zlevel</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'><p>GraphicStates</p>\n</div><div class='long'><p>GraphicStates</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_animProp' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='zrender.graphic.GraphicStates'>zrender.graphic.GraphicStates</span><br/><a href='source/States.html#zrender-graphic-GraphicStates-method-_animProp' target='_blank' class='view-source'>view source</a></div><a href='#!/api/zrender.graphic.GraphicStates-method-_animProp' class='name expandable'>_animProp</a>( <span class='pre'>state, subPropKey, key, transitionCfg, done</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Do transition animation of particular property ...</div><div class='long'><p>Do transition animation of particular property</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>state</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>subPropKey</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>key</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>transitionCfg</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>done</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});