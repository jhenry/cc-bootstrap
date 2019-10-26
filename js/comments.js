
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

	/**
	 * Generates comment card dom structure and content to be appended to comment list on play page
	 * @param object cardData The CommentCard object for the comment being appended
	 * @return object the jQuery object for the newly filled comment card element
	 */	
	buildCard: function(cardData) {
		var card = this.cardTemplate;
		card.attr('data-comment', cardData.comment.commentId);
	
		this.buildCardAvatar(card, cardData);
		this.buildCardAuthorLink(card, cardData);
		this.buildCardDate(card, cardData);
		this.buildCardActions(card, cardData);

	},
	// Fill in action links
	buildCardActions: function(card, cardData) {
		card.find('.commentAction .reply').text(this.replyText);
		card.find('.flag').text(this.reportAbuseText).attr('data-id', cardData.comment.commentId);
	},
	// Set the comment date text
	buildCardDate: function(card, cardData) {
		let commentDate = new Date(cardData.comment.dateCreated.split(' ')[0]);
		monthPadding = (String(commentDate.getMonth()+1).length === 1) ? '0' : '';
		datePadding = (String(commentDate.getDate()).length === 1) ? '0' : '';
		card.find('.commentDate').text(monthPadding + (commentDate.getMonth()+1) + '/' + datePadding + commentDate.getDate() + '/' + commentDate.getFullYear());
	},

	// Set link for the comment author's member page.
	buildCardAuthorLink: function(card, cardData) {
		let memberUrl = cc.baseUrl + '/members/' + cardData.author.username;
		card.find('.authorUrl').attr('href', memberUrl).text(cardData.author.username);
	},

	// Set an avatar if the user has uploaded one.
	buildCardAvatar: function(card, cardData) {
		if (cardData.avatar !== null) {
			card.find('.card-img').attr('src', cardData.avatar).toggle('.d-none');
			card.find('.default-avatar').toggle('.d-none');
		}
	},
	
	// Apply indent class
	indent: function(card, cardElement, parentComment) {
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
