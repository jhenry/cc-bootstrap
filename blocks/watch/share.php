<div class="row py-3">
    <div class="col-md-8">
    <?php if ($video->disableEmbed == '0' && $video->gated == '0'): ?>
            <!-- EMBED CODE -->
            <div>
                <h5>Embed</h5>
                <p><?=Language::getText('embed_text')?></p>
                <textarea class="text" rows="5" cols="58">&lt;iframe src="<?=HOST?>/embed/<?=$video->videoId?>/" width="480" height="360" frameborder="0" allowfullscreen&gt;&lt;/iframe&gt;</textarea>
                
                <p>For wordpress and similar sites, copy and paste this link to auto-embed.</p>
                <input type="text" class="text" size="58" value="<?=HOST?>/embed/<?=$video->videoId?>/" maxlength="130">
            </div>
        <?php endif; ?>
    </div>
    <div class="col-md-4 sharing-buttons">
    <h5>Share</h5>
    <?php if ($app_id = Settings::get('fb_app_id')): ?>
        <!-- FACEBOOK BUTTON -->
            <meta property="og:url" content="<?=$this->getService('Video')->getUrl($video)?>/" />
            <meta property="og:title" content="<?php echo htmlspecialchars($video->title); ?>" />
            <meta property="og:description" content="<?php echo htmlspecialchars($video->description); ?>" />
            <meta property="og:image" content="<?=$config->thumbUrl?>/<?=$video->filename?>.jpg" />
            <meta property="og:type" content="video" />
            <meta property="og:video" content="<?=$config->h264Url?>/<?=$video->filename?>.mp4">
            <meta property="og:video:type" content="video/mp4">
            <meta property="og:video:width" content="640">
            <meta property="og:video:height" content="360">
            <script>if (window.location.hash === '#facebook-share') {window.close();}</script>
            <a class="facebook" href="https://www.facebook.com/dialog/share?app_id=<your_app_id>&display=popup&href=<?=urlencode($this->getService('Video')->getUrl($video) . '/')?>&redirect_uri=<?=urlencode($this->getService('Video')->getUrl($video) . '/#facebook-share')?>" onClick="window.open(this.href, 'sharewindow','width=550,height=300');return false;"><ion-icon size="large" name="logo-facebook"></ion-icon></a>

    <?php endif; ?>
            <!-- TWITTER BUTTON -->
            <a class="twitter" href="" onClick="window.open('https://twitter.com/share?url=<?=urlencode($this->getService('Video')->getUrl($video) . '/')?>&text=<?=urlencode(Functions::cutOff(htmlspecialchars($video->description), 140))?>','sharewindow','width=650,height=400');return false;"><ion-icon size="large" name="logo-twitter"></ion-icon></a>

            <!-- ETC -->
            <a href="" onClick="window.open('http://www.reddit.com/submit?url=<?=urlencode($this->getService('Video')->getUrl($video) . '/')?>','sharewindow','width=650,height=400');return false;"><ion-icon size="large" name="logo-reddit"></ion-icon></a>

            <!-- ETC -->
            <a href="" onClick="window.open('https://www.linkedin.com/shareArticle?mini=true&url=<?=urlencode($this->getService('Video')->getUrl($video) . '/')?>','sharewindow','width=650,height=400');return false;"><ion-icon size="large" name="logo-linkedin"></ion-icon></a>

            <!-- ETC -->
            <a href="mailto:?subject=<?=$video->title?>&body=<?=urlencode($this->getService('Video')->getUrl($video) . '/')?>" ><ion-icon size="large" name="mail"></ion-icon></a>

    </div>
</div>
