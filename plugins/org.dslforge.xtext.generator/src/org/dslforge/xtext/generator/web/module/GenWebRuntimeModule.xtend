/**
 * <copyright>
 *
 * Copyright (c) 2015 PlugBee. All rights reserved.
 * 
 * This program and the accompanying materials are made available 
 * under the terms of the Eclipse Public License v1.0 which 
 * accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Amine Lajmi - Initial API and implementation
 *
 * </copyright>
 */
package org.dslforge.xtext.generator.web.module

import org.dslforge.common.AbstractGenerator
import org.dslforge.common.IWebProjectDescriptor.Mode
import org.dslforge.common.IWebProjectFactory
import org.dslforge.xtext.generator.XtextGrammar
import org.eclipse.core.runtime.IProgressMonitor

class GenWebRuntimeModule extends AbstractGenerator{
	
	var XtextGrammar grammar
	var serverSideContentAssist=true
	new() {
		relativePath = "/module/"
	}
	
	override  doGenerate(IWebProjectFactory factory, IProgressMonitor monitor) {
		grammar = factory.input as XtextGrammar
		basePath=grammar.getBasePath()
		projectName=grammar.getProjectName()
		grammarShortName= grammar.getShortName()
		factory.generateFile("src-gen/" + basePath + relativePath, "AbstractWeb" + grammarShortName.toFirstUpper + "RuntimeModule" + ".java", toJavaSrcGen(), monitor)
		if (factory.mode == Mode.Batch)
			factory.generateFile("src/" + basePath + relativePath, "Web" + grammarShortName.toFirstUpper + "RuntimeModule" + ".java", toJavaSrc(), monitor)
	}
	def toJavaSrcGen()'''
/**
 * @Generated by DSLFORGE
 */
package «projectName».module;

import org.dslforge.xtext.common.shared.SharedModule;
import com.google.inject.Binder;
«IF (serverSideContentAssist)»
import «projectName».contentassist.«grammarShortName.toFirstUpper»ProposalProvider;
import «projectName».contentassist.antlr.«grammarShortName.toFirstUpper»Parser;
import «projectName».contentassist.antlr.internal.Internal«grammarShortName.toFirstUpper»Lexer;
import org.dslforge.styledtext.jface.IContentAssistProcessor;
import org.eclipse.xtext.ui.editor.contentassist.ContentAssistContext;
import org.eclipse.xtext.ui.editor.contentassist.LexerUIBindings;
import org.eclipse.xtext.ui.editor.contentassist.XtextContentAssistProcessor;
«ENDIF»

public abstract class AbstractWeb«grammarShortName.toFirstUpper»RuntimeModule extends SharedModule {

	@Override
	public void configure(Binder binder) {
		super.configure(binder);
		«IF (serverSideContentAssist)»
		binder.bind(org.eclipse.xtext.ui.editor.contentassist.IContentAssistParser.class).to(«grammarShortName.toFirstUpper»Parser.class);
		binder.bind(Internal«grammarShortName.toFirstUpper»Lexer.class).toProvider(org.eclipse.xtext.parser.antlr.LexerProvider.create(Internal«grammarShortName.toFirstUpper»Lexer.class));
		binder.bind(org.eclipse.xtext.ui.editor.contentassist.antlr.internal.Lexer.class).annotatedWith(com.google.inject.name.Names.named(LexerUIBindings.CONTENT_ASSIST)).to(Internal«grammarShortName.toFirstUpper»Lexer.class);
		binder.bind(org.eclipse.xtext.ui.editor.contentassist.IContentProposalProvider.class).to(«grammarShortName.toFirstUpper»ProposalProvider.class);
		binder.bind(IContentAssistProcessor.class).to(XtextContentAssistProcessor.class);
		binder.bind(ContentAssistContext.Factory.class).to(org.eclipse.xtext.ui.editor.contentassist.ParserBasedContentAssistContextFactory.class);
		binder.bind(org.eclipse.xtext.ui.editor.contentassist.PrefixMatcher.class).to(org.eclipse.xtext.ui.editor.contentassist.PrefixMatcher.IgnoreCase.class);
		«ENDIF»
	}
}
'''
	
	def toJavaSrc()'''
/**
 * @Generated by DSLFORGE
 */
package «projectName».module;

import org.apache.log4j.Logger;

import com.google.inject.Binder;

public class Web«grammarShortName.toFirstUpper»RuntimeModule extends AbstractWeb«grammarShortName.toFirstUpper»RuntimeModule {

	static final Logger logger = Logger.getLogger(Web«grammarShortName.toFirstUpper»RuntimeModule.class);
	
	/**
	 * Add Custom bindings here
	 */
	@Override
	public void configure(Binder binder) {
		super.configure(binder);
		logger.info("Configuring web module " + this.getClass().getName());
	}
}
	'''
}