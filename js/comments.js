class Comment {
	constructor(){
		this.replyToText = $('meta[name="reply_to"]').attr('content');
		this.replyText = $('meta[name="reply"]').attr('content');
		this.reportAbuseText = $('meta[name="report_abuse"]').attr('content');

		this.templateUrl = cc.themeUrl + '/blocks/comment.html';

		this.lastCommentId = $('#comments-list-block > div:last-child').data('comment');
		this.commentCount = Number($('#comment-count').text());
		this.loadMoreComments = (this.commentCount > 5) ? true : false;
		this.cardTemplate = $("#comments-list-block .template"); 
	}
	// Retrieve an HTML template for the comment card structure.
	setUpCardTemplate() {
		let callback = response => $('#comments-list-block').append(response); 
		$.get(this.templateUrl).done(callback);
	}
	
	appendNew(responseData, commentForm) {
		this.resetCommentForms(commentForm);
		// Append new comment if auto-approve comments is on
		if (responseData.other.autoApprove === true) {
			let cardData = responseData.other.commentCard;
			let cardElement = this.buildCard(cardData);

			// Remove 'no comments' message if present 
			$('#no-comments').remove();

			// Update comment count text
			$('#comment-count').text(responseData.other.commentCount);

			// Un-hide and remove .template class
			cardElement.toggleClass('d-none');
			cardElement.toggleClass('template');

			// Append comment to list
			if (cardData.comment.parentId !== 0) {
				let parentComment = $('[data-comment="' + cardData.comment.parentId + '"]');
				this.indent(cardData, cardElement, parentComment);
				parentComment.after(cardElement);
			} else {
				$("#comments-list-block").append(cardElement);
			}
		}
	}

	// Load more comments into comment stream
	updateLoadingButton(loadingButton) {
			let loadingText = loadingButton.data('loading_text');
			let loadMoreText = loadingButton.html();

			// Hide load more button if no more comments are available
                        if ($('#comments-list-block .comment').length < this.commentCount) {
                            this.loadMoreComments = true;
                            $('.loadMoreComments button').text(loadMoreText);
                        } else {
                            this.loadMoreComments = false;
                            $('.loadMoreComments').remove();
                        }
	
	}

	insertMoreCards(responseData) {
		let lastCommentKey = responseData.other.commentCardList.length-1;
		this.lastCommentId = responseData.other.commentCardList[lastCommentKey].comment.commentId;
		for(let key in responseData.other.commentCardList) {
			let card = responseData.other.commentCardList[key];
			let cardId = card.comment.commentId;
			$("#comments-list-block").find(`div[data-comment=${cardId}]`).remove();
			let cardElement = this.buildCard(card);

			let parentId = card.comment.parentId;
			if (parentId !== 0) {
				let parentCard = $(`[data-comment="${parentId}"]`);
				this.indent(card, cardElement, parentCard);
			}
			cardElement.removeClass("d-none");
			cardElement.removeClass("template");
			cardElement.appendTo("#comments-list-block");
		}
	}

	/**
	 * Generates comment card dom structure and content 
	 * @param object cardData The CommentCard object for the comment being appended
	 * @return object the jQuery object for the newly filled comment card element
	 */	
	buildCard(cardData) {
		let card = this.cardTemplate.clone();
		card.attr('data-comment', cardData.comment.commentId);

		this.buildCardAvatar(card, cardData);
		this.buildCardAuthorLink(card, cardData);
		this.buildCardDate(card, cardData);
		this.buildCardActions(card, cardData);
		this.buildCardReplyTo(card, cardData);
		this.buildCardBodyText(card, cardData);

		return card;
	}

	// Add text to comment card
	buildCardBodyText(card, cardData) {
		card.find('.comment-text').text(cardData.comment.comments);
	}
	// Fill in action links
	buildCardActions(card, cardData) {
		card.find('.commentAction .reply').text(this.replyText);
		card.find('.flag').text(this.reportAbuseText).attr('data-id', cardData.comment.commentId);
	}
	// Set the comment date text
	buildCardDate(card, cardData) {
		let commentDate = new Date(cardData.comment.dateCreated.split(' ')[0]);
		let monthPadding = (String(commentDate.getMonth()+1).length === 1) ? '0' : '';
		let datePadding = (String(commentDate.getDate()).length === 1) ? '0' : '';
		card.find('.commentDate').text(monthPadding + (commentDate.getMonth()+1) + '/' + datePadding + commentDate.getDate() + '/' + commentDate.getFullYear());
	}

	// Set link for the comment author's member page.
	buildCardAuthorLink(card, cardData) {
		let memberUrl = cc.baseUrl + '/members/' + cardData.author.username;
		card.find('.authorUrl').attr('href', memberUrl).text(cardData.author.username);
	}

	// Set an avatar if the user has uploaded one.
	buildCardAvatar(card, cardData) {
		if (cardData.author.avatar !== null) {
			card.find('.card-img').attr('src', cardData.avatar);
			card.find('.default-avatar').toggleClass('d-none');
			card.find('.authorUrl').toggleClass('d-none');
		}
	}
	
	// Fill in the Reply To: User text
	buildCardReplyTo(card, cardData) {
		if (cardData.comment.parentId !== 0) {
			card.find('.commentReply').text(cumulusClips.replyToText + ' ');
			let anchor = {
				href: cc.baseUrl + '/members/' + cardData.parentAuthor.username,
				text: text(cardData.parentAuthor.username)
			};
			let parentAuthorText = $('<a>', anchor);
			card.find('.commentReply').append(parentAuthorText);
		} else {
			card.find('.commentReply').remove();
		}
	}
	// Apply indent class
	indent(card, cardElement, parentComment) {
		let indentClass = null;
		if (parentComment.hasClass('commentIndentTriple') || parentComment.hasClass('commentIndentDouble')) {
			indentClass = 'commentIndentTriple';
		} else if (parentComment.hasClass('commentIndent')) {
			indentClass = 'commentIndentDouble';
		} else {
			indentClass = 'commentIndent';
		}
		cardElement.addClass(indentClass);
	}

	// stub
	resetCommentForms(commentForm) {
		// if it's a reply, remove the reply form

		// clear out top-level form
		commentForm.find("#comment_box").val('');
	}

}


let comment = new Comment();
comment.setUpCardTemplate();

// Submit 'comment form' and attach new comment to thread
$('#comments').on("submit", "form", function(event){
	var url = cc.baseUrl + '/actions/comment/add/';
	var commentForm = $(this);
	var callback = function(responseData) {
		let comment = new Comment();
		comment.setUpCardTemplate();
		comment.appendNew(responseData, commentForm);
	}

	cc.executeAjax(url, $(this).serialize(), callback);
	event.preventDefault();
});

$('.loadMoreComments button').on('click', function(event){
		if (comment.loadMoreComments) {
			let data = {
				videoId: cc.videoId, 
				lastCommentId: comment.lastCommentId, 
				limit: 5
			};
			$.get(cc.baseUrl + '/actions/comments/get/', data, null,'json').done(function(responseData) { 
				let comment = new Comment();
				comment.setUpCardTemplate();
				comment.insertMoreCards(responseData); 
			});
		}
	event.preventDefault;
});

