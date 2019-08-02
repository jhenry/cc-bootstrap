<?php if ($loggedInUser): ?>
<div class="row p-3">
    <div class="col-md-4">
        <h5>Add this to: </h5>
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="favorites"> 
            <label class="custom-control-label" for="favorites">My Favorites</label>
        </div>
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="watch-later"> 
            <label class="custom-control-label" for="watch-later">Watch Later</label>
        </div>
    <?php if (count($userPlaylists) > 0): ?>
        <?php $playlistService = $this->getService('Playlist'); ?>
        <?php foreach ($userPlaylists as $userPlaylist): ?>
            <?php $listed = $playlistService->checkListing($video, $userPlaylist); ?>
                
            <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="custom-playlist-<?=$userPlaylist->playlistId?>"> 
                <label class="custom-control-label" for="custom-playlist-<?=$userPlaylist->playlistId?>"><?=$userPlaylist->name?> (<?=count($userPlaylist->entries)?>)</label>
            </div>
            
        <?php endforeach; ?>
    <?php endif; ?>
    New playlist:
    </div>
</div>
<?php else: ?>
<div class="row p-3">
        <div class="col">
                          <p><?=Language::getText('playlist_login', array('url' => HOST . '/login/?redirect=' . urlencode($this->getService('Video')->getUrl($video))))?></p>
    </div>
</div>
<?php endif; ?>
