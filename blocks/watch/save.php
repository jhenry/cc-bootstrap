<div class="card mb-3 border-top-0 rounded-0">
<?php if ($loggedInUser): ?>
<div class="row p-3 justify-content-between">
    <div class="col-md-4">
	<h5 class="pb-2"><?=Language::getText('add_to')?></h5>
	<div id="currentPlaylists" class="list-group">
		<?php 
		$playlistService = new PlaylistService();
		$watchLater = ($loggedInUser) ? $playlistService->getUserSpecialPlaylist($loggedInUser, \PlaylistMapper::TYPE_WATCH_LATER) : false;               
		$watchLaterCount = sizeof($watchLater->entries);
		$watchLaterListed = isInPlaylist($video, $watchLater);
		?>
		<button data-playlist_id="<?=$watchLater->playlistId?>" data-video_id="<?=$video->videoId?>" data-action="<?= ( $watchLaterListed ) ? 'remove' : 'add'; ?>" class="list-group-item btn btn-outline-primary text-left addToPlaylist watch-later" href="#"><i class="playlist-icon fa-bookmark text-success pl-1 pr-2<?= ( $watchLaterListed ) ? ' fas' : ' far'; ?>" alt="<?= ( $watchLaterListed ) ? ' Video is in playlist: ' : ' Video is not in playlist:'; ?>"></i><?=Language::getText('watch_later')?> <span class="badge badge-info playlist-count"><?= $watchLaterCount; ?></span><span class="sr-only"> videos in playlist.</span></button>

<?php 
                
                $favorites = ($loggedInUser) ? $playlistService->getUserSpecialPlaylist($loggedInUser, \PlaylistMapper::TYPE_FAVORITES) : false;               
                $favoritesCount = sizeof($watchLater->entries);
                $favoritesListed = isInPlaylist($video, $favorites);
                ?>
                <button data-playlist_id="<?=$favorites->playlistId ?>" data-video_id="<?=$video->videoId?>" data-action="<?php echo $favoritesListed ? 'remove' : 'add'; ?>" class="list-group-item btn btn-outline-primary text-left addToPlaylist favorites<?php echo $favoritesListed ? ' added' : ''?>" href="#"><i class="playlist-icon fa-star text-warning pr-2<?= ( $favoritesListed ) ? ' fas' : ' far'; ?>" alt="<?= ( $isListed ) ? 'Video is in playlist.' : 'Video not in this playlist.'; ?>"></i><?=Language::getText('favorites')?> <span class="badge badge-info playlist-count"><?= $favoritesCount; ?></span><span class="sr-only"> videos in playlist.</span></button>


    <?php if (count($userPlaylists) > 0): ?>
	<?php foreach ($userPlaylists as $playlist): ?>
<?php $isListed = isInPlaylist($video, $playlist); ?>
                <button data-playlist_id="<?= $playlist->playlistId; ?>" data-video_id="<?=$video->videoId?>" data-action="<?php echo $isListed ? 'remove' : 'add'; ?>" class="list-group-item btn btn-outline-primary text-left addToPlaylist customPlaylist<?php echo $isListed ? ' added' : ''?>" href="#"><i class="playlist-icon pr-2<?= ( $isListed ) ? ' fas fa-check-square' : ' far fa-square'; ?>" alt="<?= ( $isListed ) ? 'Video is in playlist.' : 'Video not in this playlist.'; ?>"></i><?=$playlist->name?> <span class="badge badge-info playlist-count"><?= sizeof($playlist->entries); ?></span><span class="sr-only"> videos in playlist.</span></button>
                
	<?php endforeach; ?>
    <?php endif; ?>
	</div>
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
