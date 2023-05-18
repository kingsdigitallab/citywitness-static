
$(document).ready(function(){
	$('.control').click(function(event){
		event.preventDefault();
	});

	// pressing enter on the modal forces a page reload, losing current data. Prevent this.
	$(document).keypress(function(event){
	    if (event.keyCode == 10 || event.keyCode == 13) 
	        event.preventDefault();
	});

	// shortcut
	function getSelectedText(editor_id) { return $('#'+editor_id).tinymce().selection.getContent(); }
	
	// returns true and adds an error message to the modal if selection is empty
	function checkEmptySelection(el, editor_id){
		if (getSelectedText(editor_id).length == 0) {
			$('#modal-form').append('<p class="text-danger">Please make a selection before adding a '+el+'</p>');
			return true;
		}
		else { return false; }
	}

	// manages hierarchy rules for adding markup
	function checkHierarchy(el, selectionNode, level, editor_id){
		switch(level){
			// <statement>s must descend from <body>
			case 'level1':
				if($(selectionNode).prop('tagName') == 'BODY') { return true; break; }
				else { $('#modal-form').append( '<p class="text-danger">'+ el +' can only appear at the top level</p>'); return false; break;
				}

			// <heading>, <para> can only descend from <statement> ~ or <text> seeing as we just added it ~
			case 'level2':
				if($(selectionNode).hasClass('statement') || $(selectionNode).hasClass('text')) { return true; break; }
				else { $('#modal-form').append( '<p class="text-danger">'+ el + ' can only appear inside a Statement or Text</p>'); return false; break; }

			// <rubric>s must descend from a <para>graph or <heading>
			case 'level3':
				if($(selectionNode).prop('tagName') == 'P' || $(selectionNode).hasClass('heading')) { return true; break; }
				else { $('#modal-form').append('<p class="text-danger">Rubrics can only appear inside a paragraph or heading</p>'); return false; break; }

			// <pb>, <line>, <del>, <gap>, <supplied>, <superlinear>, <add>, <underline>, <abbr>, <marginalia>, <note>
			case 'level3a':
				if($(selectionNode).prop('tagName') != 'BODY') { return true; break; }
				else { $('#modal-form').append('<p class="text-danger">This element is out of place</p>'); return false; break; }

			default:
				return false;
		}
	}

	// Adds structural markup as defined in the spec.
	$('.addStructure').click(function(){

		var editor_id = $(this).parent().attr('data-editor'),
			selectionNode = $('#'+editor_id).tinymce().selection.getNode(),
			parentNode = $(selectionNode).parent(),
			sel = getSelectedText(editor_id),
			elementType = $(this).attr('data-level');

		// statement
		if(elementType == 'statement') {
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level1'),
			emptySelection = checkEmptySelection(elementType, editor_id);

			if(validHierarchy == true && emptySelection == false) {
				$('#modal-title').text('Statement');
				$('#modal-form').append('<label for="id">ID</label><input class="form-control" type="text" id="id" />');
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="statement_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });

				$('#statement_dialog_ok').click(function(){
					if($('#id').val() == ''){
						$('#modal-validation').text('All fields are required');
					}
					else {
						var id = $('#id').val();
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<div class="statement" data-id="'+id+'">'+sel+'</div>');
						
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// text
		if(elementType == 'text') {
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level1'),
			emptySelection = checkEmptySelection(elementType, editor_id);

			if(validHierarchy == true && emptySelection == false) {
				$('#modal-title').text('text');
				$('#modal-form').append('<label for="id">ID</label><input class="form-control" type="text" id="id" />');
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="text_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });

				$('#text_dialog_ok').click(function(){
					if($('#id').val() == ''){
						$('#modal-validation').text('All fields are required');
					}
					else {
						var id = $('#id').val();
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<div class="text" data-id="'+id+'">'+sel+'</div>');
						
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// para 
		if(elementType == 'para'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level2'),
				emptySelection = checkEmptySelection(elementType, editor_id);

			if(validHierarchy == true && emptySelection == false){
				$('#modal-title').text('Paragraph');
				$('#modal-form').append('<label for="id">ID</label><input class="form-control" type="text" id="id" />');
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="para_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });

				$('#para_dialog_ok').click(function(){
					if($('#id').val() == ''){
						$('#modal-validation').text('All fields are required');
					}
					else{
						var id = $('#id').val();
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<p data-id="'+id+'">'+sel+'</p>');
						
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});

				
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// <heading>s can be provided with or without a selection, and have an optional @type attribute
		if(elementType == 'heading'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level2');

			if(validHierarchy == true){
				$('#modal-title').text('Heading');
				$('#modal-form').append('<label for="headingText">Text</label> <textarea class="form-control" id="headingText">'+sel+'</textarea>');
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="heading_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#heading_dialog_ok').click(function(){
					if($('#headingText').val() == ''){
						$('#modal-validation').text('Heading text is required');
					}
					else {
						var text = $('#headingText').val(),
							editor_id = $(this).attr('data-editor');

						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="heading">'+text+'</span>');
						
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// linebreaks
		if(elementType == 'line'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if (validHierarchy == true){
				$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, sel+'<span class="line"></span>');
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// Forme Work
		if(elementType == 'fw'){
			// working on the assumption that this can go anywhere in the hierarchy

			$('#modal-title').text('Forme Work');
			$('#modal-form').append('<label for="fwtext">Text</label><input class="form-control" type="text" id="fwtext" value="'+sel+'" />');
			$('#modal-form').append('<label for="fwtype">Type</label><select class="form-control input-small" id="fwtype"><option value="head">Head</option><option value="pageNum">PageNum</option><option value="sig">Sig</option><option value="catch">Catch</option></select>');
			$('#modal-form').append('<label for="fwplace">Place</label><select class="form-control input-small" id="fwplace"><option value="top-left">Top Left</option><option value="top-centre">Top Centre</option><option value="top-right">Top Right</option><option value="bot-left">Bottom Left</option><option value="bot-centre">Bottom Centre</option><option value="bot-right">Bottom Right</option></select>');

			$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
			$('#modal-footer').append('<button type="button" id="fw_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');
			
			$('#modal').modal({ keyboard : false, backdrop : 'static' });;

			$('#fw_dialog_ok').click(function(){
				if($('#fwtext').val() == ''){
					$('#modal-validation').text('Text is required');
				}
				else{
					var text = $('#fwtext').val(),
						type = $('#fwtype').val(),
						place = $('#fwplace').val();
					
					$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="fw" data-type="'+type+'" data-place="'+place+'">'+text+'</fw>&nbsp;');
					
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				}
			
			});

			$('#modal-cancel').click(function(){
				$('#modal-form,#modal-footer').html('');
				$('#modal-validation').text('');
				$('#modal').modal('hide');
			});
		}

		// foliobreak
		if(elementType == 'pb'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if(validHierarchy == true){
				$('#modal-title').text('Folio Break');
				$('#modal-form').append('<label for="n">Page Description (e.g. f8r)</label><input class="form-control" type="text" id="n"/>');
				
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="pb_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');
				
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#pb_dialog_ok').click(function(){
					if($('#n').val() == ''){
						$('#modal-validation').text('Page Description is required');
					}
					else{
						var n = $('#n').val();
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, sel+'<span class="pb" data-n="'+n+'"></span>&nbsp;');
						
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
				
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// note
		if(elementType == 'note'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if(validHierarchy == true){
				$('#modal-title').text('Note');
				$('#modal-form').append('<label for="text">Note text</label><textarea class="form-control" id="text">'+sel+'</textarea>');
				$('#modal-form').append('<label for="type">Type</label><select class="form-control input-small" id="type"><option value="footnote">Textual Notes</option><option value="commentary">Discursive Notes</option></select>');

				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="note_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');
				
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#note_dialog_ok').click(function(){
					if($('#text').val() == ''){
						$('#modal-validation').text('Text is required');
					}
					else{
						var text = $('#text').val(),
							type = $('#type').val();

						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="note" data-type="'+type+'">'+text+'</span>&nbsp;');

						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
				
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// reference
		if(elementType == 'reference'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if(validHierarchy == true){
				$('#modal-title').text('Reference');
				$.get('/reference_select', function(data) {
					$('#modal-form').append(data);
				});


				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="reference_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');
				
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#reference_dialog_ok').click(function(){
					var reference = $('#reference_select').find(':selected').text(),
						reference_id = $('#reference_select').val();

					if(reference == 'none'){
						$('#modal-validation').text('Select a reference');
					}
					else
					{
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<a href="#" class="reference" data-id="'+reference_id+'">'+reference+'</a>&nbsp;');

						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

	});

	// Adds editorial markup as defined in the spec.
	$('.addEditorial').click(function(){
		var editor_id = $(this).parent().attr('data-editor'),
			selectionNode = $('#'+editor_id).tinymce().selection.getNode(),
			parentNode = $(selectionNode).parent(),
			sel = getSelectedText(editor_id),
			elementType = $(this).attr('data-element');

		// rubrics
		if(elementType == 'rubric'){
			var emptySelection = checkEmptySelection(elementType, editor_id),
				validHierarchy = checkHierarchy(elementType, selectionNode, 'level3');
				
			if(validHierarchy == true && emptySelection == false){
				$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="rubric">'+sel+'</span>');
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// deletions
		if(elementType == 'del'){
			var emptySelection = checkEmptySelection(elementType, editor_id),
				validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			
			if(validHierarchy == true && emptySelection == false){
				$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="del">'+sel+'</span>');
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// gaps - an empty selection is acceptable in this case
		if(elementType == 'gap'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if(validHierarchy == true){
				$('#modal-title').text('Gap');
				$('#modal-form').append('<label for="quantity">Quantity</label><input class="form-control" type="text" id="quantity"/>');
				$('#modal-form').append('<label for="unit">Units</label><select class="form-control input-small" id="unit"><option value="chars">chars</option><option value="words">words</option></select>');
				$('#modal-form').append('<label for="reason">Reason</label><select class="form-control input-small" id="reason"><option value="illegible">illegible</option><option value="invisible">invisible</option><option value="editorial">editorial</option></select>');
				
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="gap_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#gap_dialog_ok').click(function(){
					if($('#quantity').val() == ''){
						$('#modal-validation').text('Quantity is required');
					}
					else{
						var quantity = $('#quantity').val(),
							unit = $('#unit').val(),
							reason = $('#reason').val();
						var displayString = '';
						for(var i=0; i<quantity; i++) { displayString += " ."; }
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="gap" data-quantity="'+quantity+'" data-unit="'+unit+'" data-reason="'+reason+'">'+displayString+'</span>&nbsp;');
						
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
					
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// editor text (supplied) - empty selection ok
		if(elementType == 'supplied'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if (validHierarchy == true){
				$('#modal-title').text('Supplied Text');
				$('#modal-form').append('<label for="text">Text</label><textarea class="form-control" id="text">'+sel+'</textarea>');
				$('#modal-form').append('<label for="reason">Reason</label><select class="form-control input-small" id="reason"><option value="illegible">Illegible</option><option value="invisible">Invisible</option><option value="editorial">Editorial</option></select>');
				
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="supplied_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#supplied_dialog_ok').click(function(){
					if($('#text').val() == ''){
						$('#modal-validation').text('Text is required');
					}
					else{
						var text = $('#text').val(),
							reason = $('#reason').val();
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="supplied" data-reason="'+reason+'">'+text+'</span>&nbsp;');

						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
					
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// superlinear text - empty selection ok
		if(elementType == 'superlinear'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if (validHierarchy == true){
				
				if(sel.length > 0){
					$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="superlinear">'+sel+'</span>');
				}
				else {
					$('#modal-title').text('Superlinear Text');
					$('#modal-form').append('<label for="text">Text</label><textarea class="form-control" id="text">'+sel+'</textarea></br>');
					
					$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
					$('#modal-footer').append('<button type="button" id="superlinear_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

					$('#modal').modal({ keyboard : false, backdrop : 'static' });;

					$('#superlinear_dialog_ok').click(function(){
						if($('#text').val() == ''){
							$('#modal-validation').text('Text is required');
						}
						else{
							var text = $('#text').val();
							$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="superlinear">'+text+'</span>&nbsp;');

							$('#modal-form,#modal-footer').html('');
							$('#modal-validation').text('');
							$('#modal').modal('hide');
						}
						
					});

					$('#modal-cancel').click(function(){
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					});
				}
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// additions - empty selection ok
		if(elementType == 'add'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if(validHierarchy == true){
				$('#modal-title').text('Addition');
				$('#modal-form').append('<label for="text">Text</label><textarea class="form-control" id="text">'+sel+'</textarea>');
				$('#modal-form').append('<label for="place">Placement</label><select class="form-control input-small" id="place"><option value="inline">Inline</option><option value="margin">Margin</option></select>');
				
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="addition_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#addition_dialog_ok').click(function(){
					if($('#text').val() == ''){
						$('#modal-validation').text('Text is required');
					}
					else {
						var text = $('#text').val(),
							place = $('#place').val();
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="add" data-place="'+place+'">'+text+'</span>&nbsp;');
						
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
					
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// underline - empty selection ok
		if(elementType == 'underline'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if(validHierarchy == true){
				
				if(sel.length > 0){
					$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<u>'+sel+'</u>');
				}
				else {
					$('#modal-title').text('Underline');
					$('#modal-form').append('<label for="text">Text</label><textarea class="form-control" id="text">'+sel+'</textarea>');

					$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
					$('#modal-footer').append('<button type="button" id="underline_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

					$('#modal').modal({ keyboard : false, backdrop : 'static' });;

					$('#underline_dialog_ok').click(function(){
						if($('#text').val() == ''){
							$('#modal-validation').text('Text is required');
						}
						else {
							var text = $('#text').val();
							$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<u>'+text+'</u>&nbsp;');
							
							$('#modal-form,#modal-footer').html('');
							$('#modal-validation').text('');
							$('#modal').modal('hide');
						}
						
					});

					$('#modal-cancel').click(function(){
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					});
				}
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// abbreviations - empty selection ok
		if(elementType == 'abbr'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if(validHierarchy == true){

				$('#modal-title').text('Abbreviation');
				$('#modal-form').append('<label for="text">Text</label><input class="form-control" type="text" id="text" value="'+sel+'" />');
				$('#modal-form').append('<label for="title">Title</label><input class="form-control" type="text" id="title" />');
				
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="abbr_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#abbr_dialog_ok').click(function(){
					if($('#text').val() == '' || $('#title').val() == ''){
						$('#modal-validation').text('All fields are required');
					}
					else {
						var text = $('#text').val(),
							title = $('#title').val();
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<abbr title="'+title+'">'+text+'</abbr>&nbsp;');

						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
					
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}

			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		// marginalia
		if(elementType == 'marginalia'){
			var validHierarchy = checkHierarchy(elementType, selectionNode, 'level3a');
			if(validHierarchy == true){

				$('#modal-title').text('Marginalia');
				$('#modal-form').append('<label for="text">Text</label><textarea class="form-control" id="text">'+sel+'</textarea>');
				
				$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
				$('#modal-footer').append('<button type="button" id="marginalia_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#marginalia_dialog_ok').click(function(){
					if($('#text').val() == ''){
						$('#modal-validation').text('Text is required');
					}
					else{
						var text = $('#text').val();
						$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<span class="marginalia">'+text+'</span>&nbsp;');
						
						$('#modal-form,#modal-footer').html('');
						$('#modal-validation').text('');
						$('#modal').modal('hide');
					}
					
				});

				$('#modal-cancel').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
			else {
				$('#modal-title').text('Error');
				$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
				$('#modal').modal({ keyboard : false, backdrop : 'static' });;

				$('#modal-error-ok').click(function(){
					$('#modal-form,#modal-footer').html('');
					$('#modal-validation').text('');
					$('#modal').modal('hide');
				});
			}
		}

		if(elementType == 'alternate'){
			$('#modal-title').text('Alternate Testimony');
			// WARNING: The values in the next line MUST reflect Statement primary keys.
			$('#modal-nav').html('<select name="statements" id="statement_list"><option>Select</option><option value="2">Statement 1</option><option value="3">Statement 2</option><option value="4">Statement 3</option><option value="5">Statement 4</option><option value="6">Statement 5</option><option value="7">Statement 6</option><option value="8">Statement 7</option><option value="9">Statement 8</option><option value="10">Statement 9</option><option value="11">Statement 10</option></select>');

			$('#modal-footer').append('<button type="button" id="modal-cancel" class="btn btn-default">Cancel</button>');
			$('#modal-footer').append('<button type="button" id="alternate_dialog_ok" class="btn btn-primary" data-editor="'+editor_id+'">OK</button>');

			$('#modal').modal({ keyboard : false, backdrop : 'static' });

			$('#statement_list').change(function(){
				//alert($('#statement_list option:selected').val());
				var statement_id = $('#statement_list option:selected').val();
				$.get('/alternate_testimony/'+statement_id+'/', function(data) {
					$('#modal-form').html(data);
				});
			});

			$('#alternate_dialog_ok').click(function(){
				$('#'+editor_id).tinymce().execCommand("mceAddUndoLevel", false, null);
				var current_para = $(selectionNode).attr('data-id');
					target_statement = 'w'+$('#statement_list option:selected').val(),
					target_para = $('input[name=para]:checked', '#modal-form').val();

				$(selectionNode).append('<span class="alternate">Alternate Testimony - Statement '+target_statement+' , Paragraph '+target_para+' </span>');

				$('#'+editor_id).tinymce().execCommand("mceEndUndoLevel", false, null);
				$('#modal').modal('hide');
			});

			$('#modal-cancel').click(function(){
				$('#modal-nav,#modal-form,#modal-footer').html('');
				$('#modal-validation').text('');
				$('#modal').modal('hide');
			});
		}

	});

	// differs from the above functions slightly in that a separate modal is used. This is because
	// a list of <person>s is retrieved from the database.
	$('.addPerson').click(function(){

		var editor_id = $(this).parent().attr('data-editor');
		if (checkEmptySelection('person', editor_id) == false)
		{
			var sel = getSelectedText(editor_id);

			$('#personModal').modal({ keyboard : false, backdrop : 'static' });;

			// looks nonsensical, but if clicks aren't unbound first the function sort of snowballs.
			// i.e. on the first click the function runs once, second twice, third three times, etc.
			$('#person-dialog-ok').unbind('click').click(function(){
				var personText = sel,
					personValue = $('#personList').val();
				$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<a class="person" href="" data-ref="'+personValue+'">'+personText+'</a>');

				$('#personModal').modal('hide');
			});

			$('#modal-cancel').click(function(){
				$('#personModal').modal('hide');
			});
		}
		else {
			$('#modal-title').text('Error');
			$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
			$('#modal').modal({ keyboard : false, backdrop : 'static' });;

			$('#modal-error-ok').click(function(){
				$('#modal-form,#modal-footer').html('');
				$('#modal-validation').text('');
				$('#modal').modal('hide');
			});
		}
	});


$('.addEvent').click(function(){

		var editor_id = $(this).parent().attr('data-editor');
		if (checkEmptySelection('event', editor_id) == false)
		{
			var sel = getSelectedText(editor_id);

			$('#eventModal').modal({ keyboard : false, backdrop : 'static' });;

			// looks nonsensical, but if clicks aren't unbound first the function sort of snowballs.
			// i.e. on the first click the function runs once, second twice, third three times, etc.
			$('#event-dialog-ok').unbind('click').click(function(){
				var eventText = sel,
					eventValue = $('#eventList').val();
				$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<a class="event" href="" data-ref="'+eventValue+'">'+eventText+'</a>');

				$('#eventModal').modal('hide');
			});

			$('#modal-cancel').click(function(){
				$('#eventModal').modal('hide');
			});
		}
		else {
			$('#modal-title').text('Error');
			$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
			$('#modal').modal({ keyboard : false, backdrop : 'static' });;

			$('#modal-error-ok').click(function(){
				$('#modal-form,#modal-footer').html('');
				$('#modal-validation').text('');
				$('#modal').modal('hide');
			});
		}
	});








	// similar to addPerson.
	$('.addLocation').click(function(){
		var editor_id = $(this).parent().attr('data-editor');
		if (checkEmptySelection('location', editor_id) == false)
		{
			var sel = getSelectedText(editor_id);

			$('#locationModal').modal({ keyboard : false, backdrop : 'static' });;

			$('#location-dialog-ok').unbind('click').click(function(){
				var locationText = sel,
					locationValue = $('#locationList').val();

				$('#'+editor_id).tinymce().execCommand('mceInsertContent', false, '<a class="location" href="" data-ref="'+locationValue+'">'+locationText+'</location>');
				$('#locationModal').modal('hide');
			});

			$('#modal-cancel').click(function(){
				$('#locationModal').modal('hide');
			});
		}
		else {
			$('#modal-title').text('Error');
			$('#modal-footer').append('<button type="button" id="modal-error-ok" class="btn btn-default">Dismiss</button>');
			$('#modal').modal({ keyboard : false, backdrop : 'static' });;

			$('#modal-error-ok').click(function(){
				$('#modal-form,#modal-footer').html('');
				$('#modal-validation').text('');
				$('#modal').modal('hide');
			});
		}
	});

	// removes markup from the current node.
	$('.remove').click(function(){
		var editor_id = $(this).parent().attr('data-editor'),
			selectionNode = $('#'+editor_id).tinymce().selection.getNode();
		$('#'+editor_id).tinymce().execCommand("mceAddUndoLevel", false, null);

		$(selectionNode).contents().unwrap();

		$('#'+editor_id).tinymce().execCommand("mceEndUndoLevel", false, null);

		// weird way of forcing an update, but that's tinymce for you.
		$('#'+editor_id).html($('#'+editor_id).html());

	});

});
