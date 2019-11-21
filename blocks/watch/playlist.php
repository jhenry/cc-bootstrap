<h3>Playlist</h3>
<?php $playlistAuthor = $this->getMapper('User')->getUserById($playlist->userId); ?>
<div id="playlistVideos">

  <div class="card">
    <div class="card-img-overlay p-0" style="max-height: 100px;">
      <div class="playlist-title card-title h5 p-2" style="background-color: rgba(255,255, 255, 0.8);">
        <?= $this->getService('Playlist')->getPlaylistName($playlist) ?>
      </div>
    </div>
    <div class="d-flex bg-dark justify-content-center">
      <img class="card-img-top" style="max-height: 195px; width: auto;" src="<?= getPlaylistThumbnail($playlist) ?>" alt="">
    </div>
    <div class="card-body">
      <div class="card-title">
        <p class="playlist-author card-text">
          A Playlist <?= Language::getText('by') ?>: <a href="<?= HOST ?>/members/<?= $playlistAuthor->username ?>/"><?= $playlistAuthor->username ?></a>
        </p>
      </div>
      <p class="card-text small"><?= count($playlist->entries) ?> <?= Language::GetText('videos') ?></p>
    </div>
    <ul class="list-unstyled mb-0">
      <?php $videoService = $this->getService('Video'); ?>
      <?php foreach ($playlistVideos as $playlistVideo) : ?>

        <?php
          $isCurrentVideo = false;
          $videoThumbUrl = $videoService->getUrl($playlistVideo) . "/?playlist=" . $playlist->playlistId;
          ($playlistVideo->videoId == $video->videoId) ? $isCurrentVideo = true : false;  ?>
        <li class="media border-top <?= ($isCurrentVideo) ? ' shadow' : null; ?>">
          <div class="d-flex bg-dark justify-content-center mr-2" style="width:128px;">
            <a href="<?= $videoThumbUrl ?>">
              <img class="playlist-mini-thumb" style="max-width: 128px; height: 86px;" src="<?= getVideoThumbUrl($playlistVideo); ?>" alt="">
            </a>
          </div>
          <div class="media-body">
            <p class="mt-0 mb-1">
              <?php if ($isCurrentVideo) : ?>
                <?php echo htmlspecialchars($playlistVideo->title); ?> <span class="small now-playing">(now playing)</span>
              <?php else : ?>
                <a href="<?= $videoThumbUrl ?>"><?php echo htmlspecialchars($playlistVideo->title); ?></a>
              <?php endif; ?>
            </p>
            <small class="duration"><?= $playlistVideo->duration ?></small>
          </div>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>

</div>