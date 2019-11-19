            <div id="playlistVideos">
              <header>
                  <div class="h3"><?=$this->getService('Playlist')->getPlaylistName($playlist)?></div>
                  <?php $playlistAuthor = $this->getMapper('User')->getUserById($playlist->userId); ?>
                  <p>A playlist <?=Language::getText('by')?>: <a href="<?=HOST?>/members/<?=$playlistAuthor->username?>/"><?=$playlistAuthor->username?></a></p>
              </header>
              <?php $videoService = $this->getService('Video'); ?>
              <?php foreach ($playlistVideos as $playlistVideo): ?>
              <?php endforeach; ?>
            </div>