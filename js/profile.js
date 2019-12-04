class Profile {
  constructor () {
    this.videosText = $('meta[name="videos"]').attr('content')
    this.watchAllText = $('meta[name="watch_all"]').attr('content')
    this.watchLaterText = $('meta[name="watch_later"]').attr('content')

    this.thumbUrl = $('meta[name="thumbUrl"]').attr('content');
    this.videoCount = Number($('meta[name="videoCount"]').attr('content'));
    this.playlistCount = Number($('meta[name="playlistCount"]').attr('content'));
    this.watchLaterPlaylistId = $('meta[name="watchLaterPlaylistId"]').attr('content');

    this.videoTemplateUrl = cc.themeUrl + '/templates/video_card.html'
    this.videoRequestUrl = cc.baseUrl + '/members/videos'

    //this.userId = this.getLastCommentId()
    // this.retrieveOffset = $('#member-videos .video').length;
    // this.commentCount = Number($('#comment-count').text())
    // this.loadMoreComments = (this.commentCount > 5) ? true : false
  //  this.cardTemplate = $("#video-card-template")
  }

  chunker(arr, chunkSize) {
    const sets = [] 
    const chunks = Math.ceil(arr.length / chunkSize)
    for (let i = 0, j = 0; i < chunks; i++, j += chunkSize) {
      sets[i] = arr.slice(j, j + chunkSize)
    }
    
    return sets;
  }

  loadVideoGrid(videoList) {
    const columns = 3
    const columnWidth = 12 / columns
    const videoRows = this.chunker(videoList, columns)
    for (const videos of videoRows) {
      const row = $('<div class="row pt-4"></div>')
      for (const video of videos) {
        const col = $('<div class="col-md-' + columnWidth + ' video"></div>')
        const template = $.templates('#video-card-template');
        const renderedCard = template.render(video);
        col.append(renderedCard)
        row.append(col)
        $('#videos_list').append(row);
      }

    }
  }

}

const profile = new Profile()
//profile.setUpCardTemplate(profile.videoTemplateUrl)



$('#member-videos').on('click', '.loadMoreVideos button', function (event) {
  var loadMoreButton = $(this);
  var userId = loadMoreButton.data('user');
  var retrieveOffset = $('#videos_list .video').length;
  var retrieveLimit = Number(loadMoreButton.data('limit'));
  $.ajax({
    url: cc.baseUrl + '/members/videos',
    data: { userId: userId, start: retrieveOffset, limit: retrieveLimit },
    dataType: 'json',
    success: function (responseData, textStatus, jqXHR) {
      // Append video cards
profile.loadVideoGrid(responseData.other.videoList)
      // $.each(responseData.other.videoList, function (index, value) {
      //   var template = $.templates('#video-card-template');

      //   var htmlOutput = template.render(value);

      //   $('#videos_list').append(htmlOutput);
      //   //var videoCard = buildVideoCard(cumulusClips.videoCardTemplate, value);
      //   //$('.videos_list').append(videoCard);
      // });

      // Remove load more button
      if ($('#videos_list .video').length === profile.videoCount) {
        loadMoreButton.remove();
      }
    }
  });
  event.preventDefault();
})
