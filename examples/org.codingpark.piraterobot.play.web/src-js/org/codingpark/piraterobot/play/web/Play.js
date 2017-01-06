/**
 * @Generated by DSL Forge
 */
//minify using as YUI Compressor, Google Closure Compiler, or JSMin. 
(function() {
	rap.registerTypeHandler("org.codingpark.piraterobot.play.web.editor.widget.Play", {
		factory : function(properties) {
			return new org.codingpark.piraterobot.play.web.editor.widget.Play(properties);
		},
		destructor : "destroy",	 
		properties : [ "url", "text", "editable", "status", "annotations", "scope", "proposals", "font", "dirty", "markers", "background"],
		events : ["Modify", "TextChanged", "Save", "FocusIn", "FocusOut", "Selection", "CaretEvent", "ContentAssist"],
		methods : ["addMarker", "removeMarker", "clearMarkers", "insertText", "removeText", "setProposals"]
	});

	rwt.qx.Class.define("org.codingpark.piraterobot.play.web.editor.widget.Play", {
		extend :org.dslforge.styledtext.BasicText,
		construct : function(properties) {
			this.base(arguments, properties);
		},
		members : {
						
			createEditor : function() {
				var basePath = 'rwt-resources/src-js/org/dslforge/styledtext/ace';
				ace.require("ace/config").set("basePath", basePath);
				var workerPath = 'rwt-resources/src-js/org/codingpark/piraterobot/play/web/ace';
				ace.require("ace/config").set("workerPath", workerPath);
				var themePath = 'rwt-resources/src-js/org/codingpark/piraterobot/play/web/ace';
				ace.require("ace/config").set("themePath", themePath);
				var editor = this.editor = ace.edit(this.element);
				var editable = this.editable;
				var self = this;
				if (editor != null) {
					//Set the Id of this editor
					var guid = this.url;
					
					//Set language mode
					editor.getSession().setMode("ace/mode/play");

					//Default settings
					editor.getSession().setUseWrapMode(true);
				    editor.getSession().setTabSize(4);
				    editor.getSession().setUseSoftTabs(true);
					editor.getSession().getUndoManager().reset();
					editor.setShowPrintMargin(false);
					editor.setBehavioursEnabled(true);
					editor.setWrapBehavioursEnabled(true);
					editor.setReadOnly(!editable);
					editor.$blockScrolling = Infinity;
										
					//Configure content assist feature
					this.langTools = ace.require("ace/ext/language_tools");
					this.editor.setOptions({
					    enableBasicAutocompletion: true,
					    enableSnippets: true
					});

					//Set theme
					editor.setTheme("ace/theme/eclipse");	

					this.backendCompleter = {
						getMode: function() {
							return editor.getSession().getMode();
						},
						getCompletions: function(editor, session, pos, prefix, callback) {
							self.onCompletionRequest(pos, prefix, callback);	
						},
						getDocTooltip: function(item) {
						    item.docHTML = ["<b>", item.caption, "</b>", 
						                    "<hr></hr>", 
						                    item.meta.substring(1,item.meta.length-1)
						                    ].join("");
						}
					}
					this.completers = editor.completers;
					
					//Add text hover
					var TokenTooltip = ace.require("ace/ext/tooltip").TokenTooltip;	
					editor.tokenTooltip = new TokenTooltip(editor);		 	

					//Initialize the annotations
					if (this.annotations==null) 
						this.annotations=[];
					
				 	//Initialize the index
				 	index = this.scope;

				 	//Initialize the completion proposals
				 	proposals = this.proposals;
				 	
					//Handle the global index
				 	if (this.useSharedWorker) {
						if (typeof SharedWorker == 'undefined') {	
							alert("Your browser does not support JavaScript shared workers.");
						} else {
							//Compute worker's http URL
							var filePath = 'rwt-resources/src-js/org/dslforge/styledtext/global-index.js';
							var httpURL = this.computeWorkerPath(filePath);
							var worker = this.worker = new SharedWorker(httpURL);		
							if (this.ready) {
								editor.on("change", function(event) {
									worker.port.postMessage({
										message: editor.getValue(), 
								        guid: guid, 
								        index: index
								    });
							    });
							}
							worker.port.onmessage = function(e) {
							 	//update the index reference
							 	index = e.data.index;
						    };		
						}	
				 	} 

				 	//On focus get event
					editor.on("focus", function() {
				 		self.onFocus();
				 	});
					
					//On focus lost event
				 	editor.on("blur", function() {
				 		self.onBlur();
				 	});
				 	
				 	//On input event
				 	editor.on("input", function() {
						if (!editor.getSession().getUndoManager().isClean())
							self.onModify();
				 	});
				 	
				 	//On mouse down event
				 	editor.on("mousedown", function() { 
				 	    // Store the Row/column values 
				 	}) 
				 	
				 	//On cursor move event
				 	editor.getSession().getSelection().on('changeCursor', function() { 
				 	    if (editor.$mouseHandler.isMousePressed)  {
				 	      // the cursor changed using the mouse
				 	    }
				 	    // the cursor changed
				 	    self.onChangeCursor();
				 	});
				 	editor.getSession().on('changeCursor', function() { 
				 	    if (editor.$mouseHandler.isMousePressed)  {
				 	      // remove last stored values 
				 	     console.log("remove last stored values");
				 	    }
				 	    // Store the Row/column values 
				 	    console.log("store the row/column values");
				 	}); 
				 	
				 	//On text change event
					editor.on("change", function(event) {					        
						// customize
			        });	
					
					//Bind keyboard shorcuts
					editor.commands.addCommand({
						name: 'saveFile',
						bindKey: {
						win: 'Ctrl-S',
						mac: 'Command-S',
						sender: 'editor|cli'
						},
						exec: function(env, args, request) {
							self.onSave();
						}
					});
					
					//Done
			        this.onReady();
				}
			},
			
			setScope : function(scope) {
				this.base(arguments, scope);
			},
		
			onCompletionRequest : function(pos, prefix, callback) {
				this.base(arguments, pos, prefix, callback);
			},
			
			setProposals : function(proposals) {
				this.proposals = proposals;	
			},

			onFocus: function() {
				if (typeof this.langTools.addCompleter !== "undefined") {
					this.langTools.addCompleter(this.backendCompleter);
					this.completers = this.editor.completers;
				}
				this.base(arguments);
			},
			
			onBlur: function() {
				if (typeof this.langTools.removeCompleter !== "undefined") {
					this.langTools.removeCompleter(this.backendCompleter);
					this.completers = this.editor.completers;
				}
				this.base(arguments);
			},

			destroy : function() {
				if (typeof this.langTools.disableSnippetCompleter !== "undefined") {
					this.langTools.disableSnippetCompleter();
					this.langTools.removeCompleter(this.backendCompleter);	
				}
				this.base(arguments);
			}
		}
	});
	
}());
