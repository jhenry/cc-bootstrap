<?php if ($loggedInUser): ?>
<div class="row p-3">
    <div class="col-md-4">
        <h5 class="pb-2">Add to Playlist</h5>
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
    </div>
    <div class="col-md-4 text-right">
    </div>
    <div class="col-md-4 text-right">
        <h5 class="pb-2">Create a new Playlist</h5>
        <form >
              <div class="form-group text-left">
              <label for="playlist_name"><?=Language::getText('playlist_name')?></label>
                <input type="text" class="form-control" name="playlist_name" id="playlist_name" placeholder="My Playlist">
              </div>
              <div class="form-group text-left">
              <label for="playlist_visibility"><?=Language::getText('visibility')?></label>
                <select class="form-control" name="playlist_visibility" id="playlist_visibility">
                    <option value="public"><?=Language::getText('public')?></option>
                    <option value="private"><?=Language::getText('private')?></option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary"><?=Language::getText('create_playlist_button')?></button>
        </form>
    </div>
</div>
<?php else: ?>
<div class="row p-3">
        <div class="col">
                          <p><?=Language::getText('playlist_login', array('url' => HOST . '/login/?redirect=' . urlencode($this->getService('Video')->getUrl($video))))?></p>
    </div>
</div>
<?php endif; ?>
