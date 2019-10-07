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
                displayMessage(responseData.result, responseData.message);
                if (typeof callback != 'undefined') callback(responseData, textStatus, jqXHR);
            }
        });
    }
        
};

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

