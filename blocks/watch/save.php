<div class="card mb-3 border-top-0 rounded-0">
<?php if ($loggedInUser): ?>
<div class="row p-3 justify-content-between">
    <div class="col-md-4">
	<h5 class="pb-2"><?=Language::getText('add_to')?></h5>
            <div class="button-actions">
	    <?php include $this->getFallbackPath("blocks/playlist-buttons.phtml"); ?>
            </div>

	<div id="currentPlaylists" class="list-group"></div>
    </div>
    <div class="col-md-6">
<h5><?=Language::GetText('create_new_playlist')?></h5>
		<form id="createNewPlaylist">
			<div class="form-group playlist-name">
				<label for="playlistName"><?=Language::GetText('playlist_name')?>:</label>
				<input type="text" class="form-control" name="playlist_name" id="playlistName" placeholder="<?=Language::GetText('playlist_name')?>">
			</div>
			<div class="form-group visibility">
				<span class="pr-2">
					<?=Language::getText('visibility')?>:
				</span>
				<div class="form-check form-check-inline">
					<input type="radio" class="form-check-input" value="public" id="visibility-public" name="visibility" checked>
					<label class="form-check-label pr-2" for="visibility-public"><?=Language::GetText('public')?></label> 
					<input type="radio" class="form-check-input" value="private" id="visibility-private" name="visibility">
					<label class="form-check-label" for="visibility-private"><?=Language::GetText('private')?></label> 

				</div> 
			<input type="hidden" name="action" value="create" />
                        <input type="hidden" id="video_id" name="video_id" value="<?=$video->videoId?>" />
			</div>
			<p class="text-right">
				<button class="btn btn-outline-primary" type="submit"><?=Language::GetText('create_playlist_button')?></button>
			</p>
		</form>
    </div>
</div>
<?php else: ?>
<div class="row p-3">
        <div class="col">
                          <p><?=Language::getText('playlist_login', array('url' => BASE_URL . '/login/?redirect=' . urlencode($this->getService('Video')->getUrl($video))))?></p>
    </div>
</div>
<?php endif; ?>
</div>
