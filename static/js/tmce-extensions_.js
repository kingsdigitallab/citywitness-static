$(document).ready(function(){
	$('.control').click(function(event){event.preventDefault();});
	// frequently-used calls
	function getSelectedText() { return $('#id_content').tinymce().selection.getContent(); }
	function checkEmptySelection(el){
		if (getSelectedText().length == 0) { alert('Please make a selection before adding a ' + el); return true}
		else { return false; }
	}

	function checkHierarchy(el, selectionNode){
		switch(el){
			// <statement>s must descend from <body>
			case 'statement':
				if($(selectionNode).prop('tagName') == 'BODY') { return true; break; }
				else { alert('Statements can only appear at the top level'); return false; break; }

			// <heading>s must descend from a <statement>
			case 'heading':
				if($(selectionNode).prop('tagName') == 'STATEMENT') { return true; break; }
				else { alert('Headings can only appear inside a statement'); return false; break; }

			// <para>graphs must descend from a <statement>
			case 'para':
				if($(selectionNode).prop('tagName') == 'STATEMENT') { return true; break; }
				else { alert('Paragraphs can only appear inside a statement'); return false; break; }

			// <line>breaks must descend from a <para>graph
			case 'line':
				if($(selectionNode).prop('tagName') == 'PARA') { return true; break; }
				else { alert('Linebreaks can only appear inside a paragraph'); return false; break; }

			// <pb>s must descend from a <para>graph
			case 'pb':
				if($(selectionNode).prop('tagName') == 'PARA') { return true; break; }
				else { alert('Folio Breaks can only appear inside a paragraph'); return false; break; }

			// <rubric>s must descend from a <para>graph or <heading>
			case 'rubric':
				if($(selectionNode).prop('tagName') == 'PARA' || $(selectionNode).prop('tagName') == 'HEADING') { return true; break; }
				else { alert('Rubrics can only appear inside a paragraph or heading'); return false; break; }

			// <del>etions must descend from a <para>graph or <heading>
			case 'del':
				if($(selectionNode).prop('tagName') != 'BODY') { return true; break; }
				else { alert('Deletions can only appear inside a Statement or Heading'); return false; break; }

			// <gap>s must descend from a <para>graph or <heading>
			case 'gap':
				if($(selectionNode).prop('tagName') != 'BODY') { return true; break; }
				else { alert('Gaps can only appear inside a Statement or Heading'); return false; break; }

			// <supplied> text must descend from a <para>graph or <heading>
			case 'supplied':
				if($(selectionNode).prop('tagName') != 'BODY') { return true; break; }
				else { alert('Supplied text can only appear inside a Statement or Heading'); return false; break; }

			// <superlinear> text must descend from a <para>graph or <heading>
			case 'superlinear':
				if($(selectionNode).prop('tagName') != 'BODY') { return true; break; }
				else { alert('Superlinear text can only appear inside a Statement or Heading'); return false; break; }

			// <add>itions must descend from a <para>graph or <heading>
			case 'add':
				if($(selectionNode).prop('tagName') != 'BODY') { return true; break; }
				else { alert('Additions can only appear inside a Statement or Heading'); return false; break; }

			// <underline>s must descend from a <para>graph or <heading>
			case 'underline':
				if($(selectionNode).prop('tagName') != 'BODY') { return true; break; }
				else { alert('Underlined text can only appear inside a Statement or Heading'); return false; break; }

			case 'abbr':
				if($(selectionNode).prop('tagName') != 'BODY') { return true; break; }
				else { alert('Abbreviations can only appear inside a Statement or Heading'); return false; break; }

			default:
				return false;
		}
	}


	$('.addStructure').click(function(){
		/* $(selectionNode).append('rb'); */
		var selectionNode = $('#id_content').tinymce().selection.getNode(),
			parentNode = $(selectionNode).parent(),
			sel = getSelectedText(),
			elementType = $(this).attr('data-level');

		// statement, para, 
		if(elementType == 'statement' || elementType == 'para'){
			var validHierarchy = checkHierarchy(elementType, selectionNode),
				emptySelection = checkEmptySelection(elementType);

			if(validHierarchy == true && emptySelection == false){
				$('#id_content').tinymce().execCommand('mceInsertContent', false, '<'+elementType+'>'+sel+'</'+elementType+'>');
			}
		}

		// <heading>s can be provided with or without a selection, and have an optional @type attribute
		if(elementType == 'heading'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);

			if(validHierarchy == true){
				// add required fields to .modal
				$('.modal form').append('Heading <br> <textarea id="headingText" >'+sel+'</textarea>');
				$('.modal form').append('<br><br>Type <br> <input type="text" id="headingType" />');
				$('.modal').dialog({
					title : 'Heading',
					autoOpen : true,
					modal : true,
					width : 700,
					height : 400,
					buttons : {
						'Cancel' : function(){
							$('.modal form').html('');
							$(this).dialog('close');
						},
						'Ok' : function(){
							var text = $('#headingText').val(),
								type = $('#headingType').val();
							if (type.length > 0) { $('#id_content').tinymce().execCommand('mceInsertContent', false, '<heading type="'+type+'">'+text+'</heading>'); }
							else { $('#id_content').tinymce().execCommand('mceInsertContent', false, '<heading>'+text+'</heading>'); }
							$('.modal form').html('');
							$(this).dialog('close');
						}
					}
				});
			}
		}

		// linebreaks
		if(elementType == 'line'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);
			if (validHierarchy == true){
				$('#id_content').tinymce().execCommand('mceInsertContent', false, sel+'<'+elementType+'/>');
			}
		}

		// Forme Work
		if(elementType == 'fw'){
			// working on the assumption that this can go anywhere in the hierarchy
			$('.modal form').append('Text <br> <input type="text" id="fwtext" value="'+sel+'" /><br>');
			$('.modal form').append('<br> Type <br> <select id="fwtype"><option value="head">Head</option><option value="pageNum">PageNum</option><option value="sig">Sig</option><option value="catch">Catch</option></select><br>');
			$('.modal form').append('<br> Place <br> <select id="fwplace"><option value="top-left">Top Left</option><option value="top-centre">Top Centre</option><option value="top-right">Top Right</option><option value="bot-left">Bottom Left</option><option value="bot-centre">Bottom Centre</option><option value="bot-right">Bottom Right</option></select>');
			$('.modal').dialog({
				title : 'Forme Work',
				autoOpen : true,
				modal : true,
				width : 700,
				height : 400,
				buttons : {
					'Cancel' : function(){
						$('.modal form').html('');
						$(this).dialog('close');
					},
					'Ok' : function(){
						var text = $('#fwtext').val(),
							type = $('#fwtype').val(),
							place = $('#fwplace').val();
						
						$('#id_content').tinymce().execCommand('mceInsertContent', false, '<'+elementType+' type="'+type+'" place="'+place+'">'+text+'</'+elementType+'>&nbsp;');
						$('.modal form').html('');
						$(this).dialog('close');
					}
				}
			});
		}

		// foliobreak
		if(elementType == 'pb'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);
			if(validHierarchy == true){
				$('.modal form').append('Page Description (e.g. f8r)<br><input type="text" id="n"/><br>');
				$('.modal').dialog({
					title : 'Folio Break',
					autoOpen : true,
					modal : true,
					width : 700,
					height : 400,
					buttons : {
						'Cancel' : function(){
							$('.modal form').html('');
							$(this).dialog('close');
						},
						'Ok' : function(){
							var n = $('#n').val();
							$('#id_content').tinymce().execCommand('mceInsertContent', false, sel+'<pb n="'+n+'" />&nbsp;');
							$('.modal form').html('');
							$(this).dialog('close');
						}
					}
				});
			}
		}

		//alert(parent.prop('tagName'));
		//$('#id_content').tinymce().execCommand('mceInsertContent', false, '<'+elementType+'>'+sel+'</'+elementType+'>');
	});

	$('.addEditorial').click(function(){
		var selectionNode = $('#id_content').tinymce().selection.getNode(),
			parentNode = $(selectionNode).parent(),
			sel = getSelectedText(),
			elementType = $(this).attr('data-element');

		// rubrics
		if(elementType == 'rubric'){
			var emptySelection = checkEmptySelection(elementType),
				validHierarchy = checkHierarchy(elementType, selectionNode);
				
			if(validHierarchy == true && emptySelection == false){
				$('#id_content').tinymce().execCommand('mceInsertContent', false, '<'+elementType+'>'+sel+'</'+elementType+'>');
			}
		}

		// deletions
		if(elementType == 'del'){
			var emptySelection = checkEmptySelection(elementType),
				validHierarchy = checkHierarchy(elementType, selectionNode);
			
			if(validHierarchy == true && emptySelection == false){
				$('#id_content').tinymce().execCommand('mceInsertContent', false, '<'+elementType+'>'+sel+'</'+elementType+'>');
			}
		}

		// gaps - an empty selection is acceptable in this case
		if(elementType == 'gap'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);
			if(validHierarchy == true){
				$('.modal form').append('Quantity<br><input type="text" id="quantity"/><br>');
				$('.modal form').append('Units<br><select id="unit"><option value="chars">chars</option><option value="words">words</option></select><br>');
				$('.modal form').append('Reason<br><select id="reason"><option value="illegible">illegible</option><option value="invisible">invisible</option><option value="editorial">editorial</option></select><br>');
				$('.modal').dialog({
					title : 'Gap',
					autoOpen : true,
					modal : true,
					width : 700,
					height : 400,
					buttons : {
						'Cancel' : function(){
							$('.modal form').html('');
							$(this).dialog('close');
						},
						'Ok' : function(){
							var quantity = $('#quantity').val(),
								unit = $('#unit').val(),
								reason = $('#reason').val();
							var displayString = '';
							for(var i=0; i<quantity; i++) { displayString += " ."; }
							$('#id_content').tinymce().execCommand('mceInsertContent', false, '<gap quantity="'+quantity+'" unit="'+unit+'" reason="'+reason+'">'+displayString+'</gap>&nbsp;');
							$('.modal form').html('');
							$(this).dialog('close');
						}
					}
				});
			}
		}

		// editor text (supplied) - empty selection ok
		if(elementType == 'supplied'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);
			if (validHierarchy == true){
				$('.modal form').append('Text<br><textarea id="text">'+sel+'</textarea></br>');
				$('.modal form').append('Reason<br><select id="reason"><option value="illegible">Illegible</option><option value="invisible">Invisible</option><option value="editorial">Editorial</option></select>');
				$('.modal').dialog({
					title : 'Supplied Text',
					autoOpen : true,
					width: 700,
					height: 400,
					buttons : {
						'Cancel' : function(){
							$('.modal form').html('');
							$(this).dialog('close');
						},
						'Ok' : function(){
							var text = $('#text').val(),
								reason = $('#reason').val();
							$('#id_content').tinymce().execCommand('mceInsertContent', false, '<supplied reason="'+reason+'">'+text+'</supplied>&nbsp;');
							$('.modal form').html('');
							$(this).dialog('close');
						}
					}
				});
			}
		}

		// superlinear text - empty selection ok
		if(elementType == 'superlinear'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);
			if (validHierarchy == true){
				
				if(sel.length > 0){
					$('#id_content').tinymce().execCommand('mceInsertContent', false, '<superlinear>'+sel+'</superlinear>');
				}
				else {
					$('.modal form').append('Text<br><textarea id="text">'+sel+'</textarea></br>');
					$('.modal').dialog({
						title : 'Superlinear Text',
						autoOpen : true,
						width: 700,
						height: 400,
						buttons : {
							'Cancel' : function(){
								$('.modal form').html('');
								$(this).dialog('close');
							},
							'Ok' : function(){
								var text = $('#text').val();
								$('#id_content').tinymce().execCommand('mceInsertContent', false, '<superlinear>'+text+'</superlinear>&nbsp;');
								$('.modal form').html('');
								$(this).dialog('close');
							}
						}
					});
				}
			}
		}

		// additions - empty selection ok
		if(elementType == 'add'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);
			if(validHierarchy == true){
				$('.modal form').append('Text<br><textarea id="text">'+sel+'</textarea></br>');
				$('.modal form').append('Placement<br><select id="place"><option value="inline">Inline</option><option value="margin">Margin</option></select></br>');
				$('.modal').dialog({
					title : 'Addition',
					autoOpen : true,
					width: 700,
					height: 400,
					buttons : {
						'Cancel' : function(){
							$('.modal form').html('');
							$(this).dialog('close');
						},
						'Ok' : function(){
							var text = $('#text').val(),
								place = $('#place').val();
							$('#id_content').tinymce().execCommand('mceInsertContent', false, '<add place="'+place+'">'+text+'</add>&nbsp;');
							$('.modal form').html('');
							$(this).dialog('close');
						}
					}
				});
			}
		}

		// underline - empty selection ok
		if(elementType == 'underline'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);
			if(validHierarchy == true){
				
				if(sel.length > 0){
					$('#id_content').tinymce().execCommand('mceInsertContent', false, '<underline>'+sel+'</underline>');
				}
				else {
					$('.modal form').append('Text<br><textarea id="text">'+sel+'</textarea></br>');
					$('.modal').dialog({
						title : 'Underline',
						autoOpen : true,
						width: 700,
						height: 400,
						buttons : {
							'Cancel' : function(){
								$('.modal form').html('');
								$(this).dialog('close');
							},
							'Ok' : function(){
								var text = $('#text').val();
								$('#id_content').tinymce().execCommand('mceInsertContent', false, '<underline>'+text+'</underline>&nbsp;');
								$('.modal form').html('');
								$(this).dialog('close');
							}
						}
					});
				}
			}
		}

		// abbreviations - empty selection ok
		if(elementType == 'abbr'){
			var validHierarchy = checkHierarchy(elementType, selectionNode);
			if(validHierarchy == true){

				$('.modal form').append('Text<br><input type="text" id="text" value="'+sel+'" /></br>');
				$('.modal form').append('Title<br><input type="text" id="title" /></br>');
				$('.modal').dialog({
					title : 'Abbreviation',
					autoOpen : true,
					width: 700,
					height: 400,
					buttons : {
						'Cancel' : function(){
							$('.modal form').html('');
							$(this).dialog('close');
						},
						'Ok' : function(){
							var text = $('#text').val(),
								title = $('#title').val();
							$('#id_content').tinymce().execCommand('mceInsertContent', false, '<abbr title="'+title+'">'+text+'</abbr>&nbsp;');
							$('.modal form').html('');
							$(this).dialog('close');
						}
					}
				});
			}
		}

	});

	$('.folio').click(function(){
		$('#folioModal').dialog({
			title : 'Folio Break',
			autoOpen : true,
			modal : true,
			buttons : {
				'Cancel' : function(){
					$(this).dialog('close');
				},
				'Ok' : function(){
					var footerText = $('#footerText').val(),
						headerText = $('#headerText').val();

					$(this).dialog('close');
					insertFolioBreak(headerText, footerText);
				}
			}
		});
	});

	$('.addPerson').click(function(){
		if (checkEmptySelection('person') == false)
		{
			var sel = getSelectedText();
			$('.personModal').dialog({
			title : 'Person',
			autoOpen : true,
			modal : true,
			buttons : {
				'Cancel' : function(){
					$(this).dialog('close');
				},
				'Ok' : function(){
					var personText = sel,
						personValue = $('#personList').val();

					$(this).dialog('close');
					insertPerson(personText, personValue);
					}
				}
			});
		}
	});

	$('.addLocation').click(function(){
		if (checkEmptySelection('location') == false)
		{
			var sel = getSelectedText();
			$('.locationModal').dialog({
			title : 'Location',
			autoOpen : true,
			modal : true,
			buttons : {
				'Cancel' : function(){
					$(this).dialog('close');
				},
				'Ok' : function(){
					var locationText = sel,
						locationValue = $('#locationList').val();

					$(this).dialog('close');
					insertLocation(locationText, locationValue);
					}
				}
			});
		}
	});

	function insertPerson(personText, personValue)
	{
		$('#id_content').tinymce().execCommand('mceInsertContent', false, '<person ref="'+personValue+'">'+personText+'</person>');
	}

	function insertLocation(locationText, locationValue)
	{
		$('#id_content').tinymce().execCommand('mceInsertContent', false, '<location ref="'+locationValue+'">'+locationText+'</location>');
	}

	function insertFolioBreak(headerText, footerText)
	{
		var folioBreakString = '';
		if(footerText.length > 0) { folioBreakString = folioBreakString + '<foliofooter>'+footerText+'</foliofooter>'; }
		folioBreakString = folioBreakString + '<folio />';
		if(headerText.length > 0) { folioBreakString = folioBreakString + '<folioheader>'+headerText+'</folioheader>'; }

		var thisNode = $('#id_content').tinymce().selection.getNode();
		$(thisNode).after(folioBreakString);
		$('#id_content').tinymce().execCommand('mceAddUndoLevel');
	}

});