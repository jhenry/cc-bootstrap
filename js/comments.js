class Comment {
	constructor(){
		this.replyToText = $('meta[name="reply_to"]').attr('content');
		this.replyText = $('meta[name="reply"]').attr('content');
		this.reportAbuseText = $('meta[name="report_abuse"]').attr('content');

		this.templateUrl = cc.themeUrl + '/blocks/comment.html';
		this.requestUrl = cc.baseUrl + '/actions/comments/get/';

		this.lastCommentId = this.getLastCommentId(); 
		this.commentCount = Number($('#comment-count').text());
		this.loadMoreComments = (this.commentCount > 5) ? true : false;
		this.cardTemplate = $(".comment-stream .template"); 
	}

	getLastCommentId() {
		return $('#comments-list-block > div:last-child').data('comment');
	}

	// Retrieve an HTML template for the comment card structure.
	setUpCardTemplate() {
		if(!this.cardTemplate.length){
		let callback = response => $('.comment-stream').append(response); 
		$.get(this.templateUrl).done(callback);
		}
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

	// Set load more button to "loading..."
	startLoadingButton(loadingButton) {
		let loadMoreText = loadingButton.html();
		let loadingText = loadingButton.data('loading_text');
		loadingButton.html(loadingText);

		return loadMoreText
	}
	finishLoadingButton(loadMoreText){
		let visibleCards = $('#comments-list-block .comment').length;

		// Hide load more button if no more comments are available
		if (visibleCards < comment.commentCount) {
			this.loadMoreComments = true;
			$('.loadMoreComments button').html(loadMoreText);
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

	// Handle reply form setup when user clicks a reply button
	// TODO: Indent reply form to match parent.
	insertReplyForm(parentCommentNode){
		let commentForm = $('#comments > .commentForm');
		this.resetCommentForms(commentForm);
		$('.commentReplyForm').remove();
		let parentComment = parentCommentNode;
		let replyForm = commentForm.clone();
		let parentAuthor = parentComment.find(".commentAuthor a").html();

		// Clean up and re-use cloned comment form
		replyForm.find(".comment-form-head").remove();
		replyForm.find(".comment-label-text").text(`${this.replyToText} ${parentAuthor}`);
		replyForm.find(".form-actions button").text('Post Reply');
		replyForm.addClass('commentReplyForm');
		parentComment.after(replyForm);
		replyForm.find('input[name="parentCommentId"]').val(parentComment.data('comment'));
		replyForm.find('textarea').focus().val('');
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
			card.find('.authorAvatar').attr('src', cardData.avatar);
			card.find('.default-avatar').toggleClass('d-none');
			card.find('.authorAvatar').toggleClass('d-none');
		}
	}
	
	// Fill in the Reply To: User text
	buildCardReplyTo(card, cardData) {
		if (cardData.comment.parentId !== 0) {
			card.find('.commentReply').text(this.replyToText + ' ');
			let anchor = {
				href: cc.baseUrl + '/members/' + cardData.parentAuthor.username,
				text: cardData.parentAuthor.username
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
		commentForm.find(".comment-box").val('');
	}

}


let comment = new Comment();
comment.setUpCardTemplate();

// Submit 'comment form' and attach new comment to thread
$('.comments-actionable').on("submit", "form", function(event){
	var url = cc.baseUrl + '/actions/comment/add/';
	var commentForm = $(this);
	var callback = function(responseData) {
		let comment = new Comment();
		comment.setUpCardTemplate();
		comment.appendNew(responseData, commentForm);
		cc.displayMessage(responseData.result, responseData.message, '.comment-form-head');
	}

	cc.executeAjax(url, $(this).serialize(), callback);
	event.preventDefault();
});

$('.loadMoreComments button').on('click', function(event){
	if (comment.loadMoreComments) {
		let loadMoreText = comment.startLoadingButton($(this));
		let data = {
			videoId: cc.videoId, 
			lastCommentId: comment.getLastCommentId(), 
			limit: 5
		};
		let callback = function(responseData) { 
			let comment = new Comment();
			comment.setUpCardTemplate();
			comment.insertMoreCards(responseData); 
			comment.finishLoadingButton(loadMoreText);
		}
		$.get(comment.requestUrl, data, callback,'json');//.done(callback);
	}
	event.preventDefault;
});
	
$(".comments-actionable").on('click', '.reply', function(event){
	comment.insertReplyForm($(this).parents('.comment'));
});
