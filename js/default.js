var cc = {

    baseUrl: $('meta[name="baseUrl"]').attr('content'),
    themeUrl: $('meta[name="themeUrl"]').attr('content'),
    loggedIn: $('meta[name="loggedIn"]').attr('content'),
    
    //if on the watch page?
    videoId:  $('meta[name="videoId"]').attr('content'),

    // On like click 
    likeVideoRating: function () {
        console.log( "This was liked!" );
        url = baseUrl+'/actions/rate/';
        data = {video_id: videoId, rating: 1};
        callback = function(responseData) {
            if (responseData.result === true) {
                $('.actions .left .like').text(responseData.other.likes);
                $('.actions .left .dislike').text(responseData.other.dislikes);
            }
            window.scrollTo(0, 0);
        }
        this.executeAction(url, data, callback);
        return false;
    },
	/**
 * Display message sent from the server handler script for page actions
 * @param boolean result The result of the requested action (true = Success, false = Error)
 * @param string message The textual message for the result of the requested action
 * @return void Message block is displayed and styled accordingly with message.
 * If message block is already visible, then it is updated.
 */
	displayMessage: function displayMessage(result, message)
{
    var cssClass = (result === true) ? 'success' : 'errors';
    var existingClass = ($('.message').hasClass('success')) ? 'success' : 'errors';
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
                this.displayMessage(responseData.result, responseData.message);
                if (typeof callback != 'undefined') callback(responseData, textStatus, jqXHR);
            }
        });
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
	console.log('here');
	//event.preventDefault();

	var callback = function(response){
		if (response.result) {
			var nameAndCount = link.text().replace(/\([0-9]+\)/, '(' + response.other.count + ')');
			link.text(nameAndCount);
			link.toggleClass('added');
			link.data('action', action === 'add' ? 'remove' : 'add');
		} else {
			window.scrollTo(0, 0);
		}
	};

	cc.executeAjax(url, data, callback);
	event.preventDefault();
	});

$( ".like" ).click(function() {
    cc.likeVideoRating();
});

$(function(){
	bsCustomFileInput.init();
});


$('.btn-clipboard').tooltip({
  trigger: 'click',
  placement: 'bottom'
});

function setTooltip(btn, message) {
  $(btn).tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show');
}

function hideTooltip(btn) {
  setTimeout(function() {
    $(btn).tooltip('hide');
  }, 1000);
}

// Clipboard

var clipboard = new ClipboardJS('.btn-clipboard');

clipboard.on('success', function(e) {
  setTooltip(e.trigger, 'Copied!');
  hideTooltip(e.trigger);
});

clipboard.on('error', function(e) {
  setTooltip(e.trigger, 'Copy Failed!');
  hideTooltip(e.trigger);
});




// Add/remove video to playlist on play page
/*
	*/
