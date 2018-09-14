void 0===Craft.Navigation&&(Craft.Navigation={}),function($){function e(e){var t="";$.each(e,function(e,n){var i=n.disabled?"disabled":"";t+='<option value="'+n.value+'" '+i+">"+n.label+"</option>"}),$('select[name="parent"]').each(function(e,n){var i=$(n).val();$(n).html(t),$(n).val(i)})}Craft.Navigation=Garnish.Base.extend({nav:null,siteId:null,structure:null,structureElements:{},elementType:null,elementModals:[],$builderContainer:$(".js-nav-builder"),$structureContainer:$(".js-nav-builder .structure"),$emptyContainer:$(".js-navigation-empty"),$addElementButton:$(".js-btn-element-add"),$addElementLoader:$(".nav-content-pane .buttons .spinner"),$manualForm:$("#manual-form"),$manualLoader:$("#manual-form .spinner"),$template:$("#js-node-template").html(),init:function(e,t){this.nav=e,this.siteId=t.siteId,this.structure=this.$structureContainer.data("structure");for(var n=this.$structureContainer.find("li"),i=0;i<n.length;i++){var s=$(n[i]),a=s.find(".element").data("id");this.structureElements[a]=new Craft.Navigation.StructureElement(this,s)}this.addListener(this.$addElementButton,"activate","showModal"),this.addListener(this.$manualForm,"submit","onManualSubmit")},showModal:function(e){this.elementType=$(e.currentTarget).data("element-type"),this.elementModals[this.elementType]?this.elementModals[this.elementType].show():this.elementModals[this.elementType]=this.createModal(this.elementType)},createModal:function(e){return Craft.createElementSelectorModal(e,{criteria:{enabledForSite:null,siteId:this.siteId},sources:"*",multiSelect:!0,onSelect:$.proxy(this,"onModalSelect")})},onModalSelect:function(e){for(var t=$('.tab-list-item[data-element-type="'+this.elementType.replace(/\\/gi,"\\\\")+'"]'),n=t.find(".js-parent-node select").val(),i=t.find("#newWindow-field input").val(),s=0;s<e.length;s++){var a=e[s];this.elementModals[this.elementType].$body.find('tr[data-id="'+a.id+'"]').removeClass("sel");var d={navId:this.nav.id,siteId:this.siteId,elementId:a.id,title:a.label,url:a.url,type:this.elementType,newWindow:i,parentId:n};this.saveNode(d)}},onManualSubmit:function(e){e.preventDefault();var t=this.$manualForm.find(".js-parent-node select").val(),n=this.$manualForm.find("#newWindow-field input").val(),i={navId:this.nav.id,siteId:this.siteId,title:this.$manualForm.find("#title").val(),url:this.$manualForm.find("#url").val(),newWindow:n,parentId:t};this.saveNode(i)},addNode:function(e){var t=this.$template.replace(/__siteId__/gi,e.siteId?e.siteId:"").replace(/__status__/gi,e.enabled?"enabled":"disabled").replace(/__title__/gi,e.title).replace(/__id__/gi,e.id).replace(/__url__/gi,e.url).replace(/__type__/gi,e.elementDisplayName?e.elementDisplayName:"manual"),n=$(t),i=this.structure.$container;if(e.newParentId>0){var s=this.structure.$container.find('.element[data-id="'+e.newParentId+'"]').closest("li"),a=s.find("> ul"),d=s.data("level");a.length||(a=$("<ul/>"),a.appendTo(s)),i=a}return n.appendTo(i),this.structure.structureDrag.addItems(n),n.css("margin-bottom",-30),n.velocity({"margin-bottom":0},"fast"),n},saveNode:function(t){this.$manualLoader.removeClass("hidden"),this.$addElementLoader.removeClass("hidden"),Craft.postActionRequest("navigation/nodes/save-node",t,$.proxy(function(t,n){if(this.$manualLoader.addClass("hidden"),this.$addElementLoader.addClass("hidden"),t.success){this.$manualForm.find("#title").val(""),this.$manualForm.find("#url").val("");var i=t.node.id,s=this.addNode(t.node);this.structureElements[i]=new Craft.Navigation.StructureElement(this,s),this.$emptyContainer.addClass("hidden"),e(t.parentOptions),Craft.cp.displayNotice(Craft.t("navigation","Node added."))}else Craft.cp.displayError(t.message)},this))}}),Craft.Navigation.StructureElement=Garnish.Base.extend({container:null,structure:null,$node:null,$elements:null,$element:null,$settingsBtn:null,$deleteBtn:null,init:function(e,t){this.container=e,this.structure=e.structure,this.$node=t,this.$element=t.find(".element:first"),this.$settingsBtn=this.$node.find(".settings:first"),this.$deleteBtn=this.$node.find(".delete:first"),this.structure.structureDrag.settings.onDragStop=$.proxy(this,"onDragStop"),this.addListener(this.$settingsBtn,"click","showSettings"),this.addListener(this.$element,"dblclick","showSettings"),this.addListener(this.$deleteBtn,"click","removeNode")},onDragStop:function(){var t=this.$element.data("id"),n=this.$element.data("site-id"),i=this.container.nav.id,s={nodeId:t,siteId:n,navId:i};setTimeout(function(){Craft.postActionRequest("navigation/nodes/move",s,$.proxy(function(t,n){t.success&&e(t.parentOptions)},this))},500)},showSettings:function(){new Craft.Navigation.Editor(this.$element)},removeNode:function(){for(var t=[],n=this.$node.find(".element"),i=0;i<n.length;i++)t[i]=$(n[i]).data("id");confirm(Craft.t("navigation","Are you sure you want to delete “{title}” and its descendants?",{title:this.$element.data("label")}))&&Craft.postActionRequest("navigation/nodes/delete",{nodeIds:t},$.proxy(function(t,i){t.success?(Craft.cp.displayNotice(Craft.t("navigation","Node deleted.")),e(t.parentOptions),n.each($.proxy(function(e,t){this.structure.removeElement($(t)),delete this.container.structureElements[$(t).data("id")]},this)),0==Object.keys(this.container.structureElements).length&&this.container.$emptyContainer.removeClass("hidden")):Craft.cp.displayError(t.errors)},this))}}),Craft.Navigation.Editor=Garnish.Base.extend({$node:null,nodeId:null,siteId:null,$form:null,$fieldsContainer:null,$cancelBtn:null,$saveBtn:null,$spinner:null,hud:null,init:function(e){this.$node=e,this.nodeId=e.data("id"),this.siteId=e.data("site-id"),this.$node.addClass("loading");var t={nodeId:this.nodeId,siteId:this.siteId};Craft.postActionRequest("navigation/nodes/editor",t,$.proxy(this,"showEditor"))},showEditor:function(e,t){if(e.success){this.$node.removeClass("loading");var n=$();this.$form=$("<form/>"),$('<input type="hidden" name="nodeId" value="'+this.nodeId+'">').appendTo(this.$form),$('<input type="hidden" name="siteId" value="'+this.siteId+'">').appendTo(this.$form),this.$fieldsContainer=$('<div class="fields"/>').appendTo(this.$form),this.$fieldsContainer.html(e.html),Craft.initUiElements(this.$fieldsContainer);var i=$('<div class="hud-footer"/>').appendTo(this.$form),s=$('<div class="buttons right"/>').appendTo(i);this.$cancelBtn=$('<div class="btn">'+Craft.t("app","Cancel")+"</div>").appendTo(s),this.$saveBtn=$('<input class="btn submit" type="submit" value="'+Craft.t("app","Save")+'"/>').appendTo(s),this.$spinner=$('<div class="spinner left hidden"/>').appendTo(s),n=n.add(this.$form),this.hud=new Garnish.HUD(this.$node,n,{bodyClass:"body nav-editor-hud",closeOtherHUDs:!1}),this.hud.on("hide",$.proxy(function(){delete this.hud},this)),this.addListener(this.$saveBtn,"click","saveNode"),this.addListener(this.$cancelBtn,"click","closeHud")}},saveNode:function(t){t.preventDefault(),this.$spinner.removeClass("hidden");var n=this.$form.serialize(),i=this.$node.parent().find(".status"),s=this.$node.find(".target");Craft.postActionRequest("navigation/nodes/save-node",n,$.proxy(function(t,n){this.$spinner.addClass("hidden"),t.success?(Craft.cp.displayNotice(Craft.t("navigation","Node updated.")),e(t.parentOptions),this.$node.parent().data("label",t.node.title),this.$node.parent().find(".title").text(t.node.title),t.node.enabled&&t.node.enabledForSite?(i.addClass("enabled"),i.removeClass("disabled")):(i.addClass("disabled"),i.removeClass("enabled")),this.closeHud()):(Garnish.shake(this.hud.$hud),Craft.cp.displayError(t.errors))},this))},closeHud:function(){this.hud.hide(),delete this.hud}})}(jQuery);
//# sourceMappingURL=./navigation.js.map