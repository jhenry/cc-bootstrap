<?php

/**
 * Retrieves the CSS indentation class to use for a comment card
 * @staticvar array $commentCatalog Internal catalog of generated comment indent classes
 * @param Comment $comment The comment whose indent class will be retrieved
 * @return string Returns the name of the CSS indent class
 */
function getCommentIndentClass(Comment $comment)
{
    static $commentCatalog = array();
    
    // Determine which indent class to provide
    if ($comment->parentId == 0) {
        $indentClass = '';
    } else {
        $parentIndentClass = $commentCatalog[$comment->parentId];
        if ($parentIndentClass == '') {
            $indentClass = 'commentIndent';
        } else if ($parentIndentClass == 'commentIndent') {
            $indentClass = 'commentIndentDouble';
        } else {
            $indentClass = 'commentIndentTriple';
        }
    }
        
    // Update comment catalog and return indent class
    $commentCatalog[$comment->commentId] = $indentClass;
    return $indentClass;
}

/**
 * Builds full URL to a user's profile
 * @param User $user User whose profile URL will be generated for
 * @return string Returns the URL to user's profile 
 */
function getUserProfileLink(User $user)
{
    return HOST . '/members/' . $user->username;
}

/**
 * Retrieves full URL to an image to be used as the given playlist's thumbnail
 * @param Playlist $playlist The playlist to retrieve thumbnail image for
 * @return string Returns URL to the thumbnail for a playlist's card 
 */
function getPlaylistThumbnail(Playlist $playlist)
{
    $config = Registry::get('config');
    $videoMapper = new VideoMapper();
    $video = $videoMapper->getVideoById($playlist->entries[0]->videoId);
    return $config->thumbUrl . '/' . $video->filename . '.jpg';
}

/**
 * Retrieves full URL to an image to be used as the given video thumbnail
 * @param Video $video The video to retrieve thumbnail image for
 * @return string Returns URL to the thumbnail for a video
 */
function getVideoThumbUrl(Video $video)
{
    $config = Registry::get('config');

    if( class_exists('CustomThumbs') ){
        $url = CustomThumbs::thumb_url($video->videoId);
    }
    else {
        $url = $config->thumbUrl . "/" . $featuredVideo->filename . ".jpg";
    }

    return $url;
}


/**
 * Output a custom video card block to the browser
 * @param string $viewFile Name of the block to be output
 * @return mixed Block is output to browser
 *
 **/
function videoCardBlock($viewFile, $video)
{
    // Detect correct block path
    $request_block = $this->getFallbackPath("blocks/$viewFile");
    $block = ($request_block) ? $request_block : $viewFile;
    extract(get_object_vars($this->vars));
    include($block);
}
                
/**
 * Set message type class to use bootstrap alert styles
 * @param string $message_type status message passed from controller
 * @return string bootstrap message type
 *
 **/
function setMessageType($message)
{
    if ( $message ){
        if ( $message_type == 'errors' ){
            $message_type = 'alert-danger';
        }
        if ( $message_type == 'success' ){
            $message_type = 'alert-success';
        }
	return $message_type;
    }
}


/**
 * Show attachment list item
 * @param array $fileInfo array containing name, size and temp path.
 * @return string html for the attachment item
 *
 **/
function attachmentItem($fileInfo, $attachmentCount)
{
	$attachedItem = '
                        <input type="hidden" name="attachment[' . $attachmentCount . '][name]" value="' . $fileInfo['name'] . '" />
                        <input type="hidden" name="attachment[' . $attachmentCount . '][size]" value="' . $fileInfo['size'] . '" />
                        <input type="hidden" name="attachment[' . $attachmentCount . '][temp]" value="' . $fileInfo['temp'] . '" />

                        <h6 class="title card-header">' . $fileInfo['name'] . ' (' . \Functions::formatBytes($fileInfo['size'],0) . ')</span> <a class="btn btn-sm btn-outline-danger remove" href="#" role="button">Remove</a>
                        <div class="upload-ready card-body pt-2 pb-0">
				<p class="text-right"><a class="btn btn-sm btn-outline-danger remove" href="#" role="button">Remove</a></p>
                        </div>';

	return $attachedItem;
}
