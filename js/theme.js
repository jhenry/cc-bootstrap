var cc = {

	baseUrl: $('meta[name="baseUrl"]').attr('content'),
	themeUrl: $('meta[name="themeUrl"]').attr('content'),
	loggedIn: $('meta[name="loggedIn"]').attr('content'),

	//if on the watch page?
	videoId:  $('meta[name="videoId"]').attr('content'),

	/**
	 * Display message sent from the server handler script for page actions
	 * @param boolean result The result of the requested action (true = Success, false = Error)
	 * @param string message The textual message for the result of the requested action
	 * @param bool/string The name of a container to append the message to;  Boolean false if using default.
	 * @return void Message block is displayed and styled accordingly with message.
	 * If message block is already visible, then it is updated.
	 */
	displayMessage: function (result, message, appendContainer = false)
	{
		// if we were sent a parent element to put a message in,
		// and the message element hasn't already been added to it
		if( appendContainer && !$(appendContainer).find('.message').length ) {
			let messageContainer = $('<div></div>')
				.addClass('message alert')
				.html('<p>' + message + '</p>');

			$(appendContainer).append(messageContainer);
		}
		var cssClass = (result === true) ? 'alert-success' : 'alert-danger';
		var existingClass = ($('.message').hasClass('alert-success')) ? 'alert-success' : 'alert-danger';
		$('.message').show();
		$('.message').html(message);
		$('.message').removeClass(existingClass);
		$('.message').addClass(cssClass);

	},
	/**
	 * Send AJAX request to the action's server handler script
	 * @param string url Location of the action's server handler script
	 * @param json || string data The data to be passed to the server handler script
	 * @param function callback (Optional) Code to be executed once AJAX call to handler script is complete
	 * @return void Message is display according to server response. Any other
	 * follow up behaviour is performed within the callback
	 */
	executeAjax: function (url, data, callback)
	{
		$.ajax({
			type        : 'POST',
			data        : data,
			dataType    : 'json',
			url         : url,
			success     : function(responseData, textStatus, jqXHR){
				if (typeof callback != 'undefined') callback(responseData, textStatus, jqXHR);
			}
		});
	},
	/**
	 * Update playlist icons and messaging when saving videos to playlists.
	 * @param obj response from server
	 * @param jQuery object containing the dom anchor for the playlist that was clicked
	 * @param string action toggle indicator to determine the intent of the click (remove/add)
	 */
	savedToPlaylist: function (response, link, action) {
		//Put the server response into the alert container
		this.displayMessage(response.result, response.message, '.header-secondary');

		if (response.result) {
			//TODO: update counts for other playlists on the page
			link.find('.playlist-count').text(response.other.count);
			link.find('.playlist-icon').toggleClass('far');
			link.find('.playlist-icon').toggleClass('fas');
			this.toggleCustomPlaylistIcons(link);

			// For custom (user) playlists, toggle the checkbox icon, and update the alt.
			if(action === 'add') {
				link.find('.playlist-icon').attr('alt', 'Video is in playlist:');
				link.data('action', 'remove');
			} else {
				link.find('.playlist-icon').attr('alt', 'Video is not in playlist:');
				link.data('action', 'add');
			}
			link.data('action', action === 'add' ? 'remove' : 'add');
		} else {
			// Something went wrong, scroll up so user sees alert messaging.
			window.scrollTo(0, 0);
		}
	},
	
	// after like click 
	showRatingUpdate: function (responseData, element) {
			this.displayMessage(responseData.result, responseData.message, '.header-secondary');
			if (responseData.result === true) {
				//update likes and toggle class
				$('.like .likes').text(responseData.other.likes);
				element.find('i').toggleClass('far');
				element.find('i').toggleClass('fas');
				$('.actions .left .dislike').text(responseData.other.dislikes);
			}
			window.scrollTo(0, 0);
	},

	toggleCustomPlaylistIcons: function(link){
		if( link.hasClass("customPlaylist") ) { 
			link.find('.playlist-icon').toggleClass('fa-check-square'); 
			link.find('.playlist-icon').toggleClass('fa-square');
		}
	},
	setTooltip: function (btn, message) {
		$(btn).tooltip('hide')
			.attr('data-original-title', message)
			.tooltip('show');
	},

	hideTooltip: function (btn) {
		setTimeout(function() {
			$(btn).tooltip('hide');
		}, 1000);
	}, 

	/*
	 * Add pagination styles to the appropriate DOM elements.  
	 * Generated HTML is in core application files.
	 */
	paginate: function() {
		$('#pagination').addClass('pagination');
		$('#pagination').wrap('<nav aria-label="page navigation"></nav>');
		$('#pagination').find('li').addClass('page-item');
		$('#pagination').find('a').addClass('page-link');
		$('#pagination').find('strong').addClass('page-link');
		$('#pagination').find('strong').parent().addClass('active');

	}
        
};

$('.addToPlaylist').on('click', function(event){
	var link = $(this);
	var action = $(this).data('action');
	var url = cc.baseUrl+'/actions/playlist/';
	var data = {
		action: action,
		video_id: $(this).data('video_id'),
		playlist_id: $(this).data('playlist_id')
	};
	var callback = function(response){ cc.savedToPlaylist(response, link, action) };

	cc.executeAjax(url, data, callback);
	event.preventDefault();

	});

$('form#createNewPlaylist').submit(function(event){
            var createPlaylistForm = $(this);
            var data = $(this).serialize();
            var url = cc.baseUrl + '/actions/playlist/';
	var video_id = createPlaylistForm.find('#video_id').val();
            var callback = function(createPlaylistResponse){
		cc.displayMessage(createPlaylistResponse.result, createPlaylistResponse.message, '.header-secondary');
		    var newButton = '<button data-playlist_id="' + createPlaylistResponse.other.playlistId + '" data-video_id="'+ video_id +'" data-action="remove" class="list-group-item btn btn-outline-primary text-left addToPlaylist customPlaylist" href="#"><i class="playlist-icon pr-2 fas fa-check-square" alt="Video is in this playlist."></i>' + createPlaylistResponse.other.name + ' <span class="badge badge-info playlist-count">' + createPlaylistResponse.other.count + '</span><span class="sr-only"> videos in playlist.</span></button>';
                $('#currentPlaylists').append(newButton);
                createPlaylistForm.find('input[type="text"]').val('');
                createPlaylistForm.find('#visibility-public').prop( "checked", true );
            };
            cc.executeAjax(url, data, callback);
            event.preventDefault();
        });

// Attach flag action to flag links / buttons
    $('.report-content').on('click', function(){
        var url = cc.baseUrl + '/actions/flag/';
        var data = {
		type: $(this).data('type'), 
		id: $(this).data('id')
	};
            var callback = function(response){
		cc.displayMessage(response.result, response.message, '.header-secondary');
            };
        cc.executeAjax(url, data, callback);
	    window.scrollTo(0, 0);
	    event.preventDefault();
    });

$( ".like" ).click(function() {
		url = cc.baseUrl + '/actions/rate/';
		data = {
			video_id: $(this).data('video_id'), 
			rating: $(this).data('rating')
		};
		callback = function(responseData) {
			cc.showRatingUpdate(responseData, $(this));
		}
		cc.executeAjax(url, data, callback);
		event.preventDefault();
});

cc.paginate();

// ClipboardJS
var clipboard = new ClipboardJS('.btn-clipboard');

clipboard.on('success', function(e) {
	cc.setTooltip(e.trigger, 'Copied!');
	cc.hideTooltip(e.trigger);
});

clipboard.on('error', function(e) {
	cc.setTooltip(e.trigger, 'Copy Failed!');
	cc. hideTooltip(e.trigger);
});

$('.btn-clipboard').tooltip({
	trigger: 'click',
	placement: 'bottom'
});

