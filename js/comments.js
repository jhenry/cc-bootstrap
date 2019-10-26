
var comments = {
        lastCommentId : $('.commentList > div:last-child').data('comment'),
        commentCount : Number($('#comments .totals span').text()),
        loadMoreComments : (this.commentCount > 5) ? true : false,
	$.get(cc.themeUrl + '/blocks/comment.html', function(responseData, textStatus, jqXHR){this.cardTemplate = responseData;});

	showNew: function(responseData, commentForm) {
		this.resetCommentForms(commentForm);
		// Append new comment if auto-approve comments is on
		if (responseData.other.autoApprove === true) {
			var cardElement = this.buildCard(this.cardTemplate, responseData.other.commentCard);
			var card = responseData.other.commentCard;

			// Remove 'no comments' message if present 
			$('#no-comments').remove();

			// Update comment count text
			$('#comment-count').text(responseData.other.commentCount);

			// Append comment to list
			if (card.comment.parentId !== 0) {
				var parentComment = $('[data-comment="' + card.comment.parentId + '"]');
				this.indent(card, cardElement, parentComment);
				parentComment.after(cardElement);
			} else {
				$('#comments-list-block').append(cardElement);
			}
		}
	},
	
	// Apply indent class
	indent: function (card, cardElement, parentComment) {
		var indentClass;
		if (parentComment.hasClass('commentIndentTriple') || parentComment.hasClass('commentIndentDouble')) {
			indentClass = 'commentIndentTriple';
		} else if (parentComment.hasClass('commentIndent')) {
			indentClass = 'commentIndentDouble';
		} else {
			indentClass = 'commentIndent';
		}
		cardElement.addClass(indentClass);
	},

	// stub
	resetCommentForms: function () {
		// if it's a reply, remove the reply form

		// clear out top-level form
	}
}; 

// Submit 'comment form' and attach new comment to thread
$('#addComment').submit(function(event){
	var url = cc.baseUrl+'/actions/comment/add/';
	var commentForm = $(this);

	var callback = function(responseData) {
		comments.showNew(responseData, commentForm);
	}

	cc.executeAjax(url, $(this).serialize(), callback);
	event.preventDefault();
}
