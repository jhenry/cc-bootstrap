            <p class="totals"><span><?=$commentCount?></span> <?=Language::getText('comments_total')?></p>

            <?php if ($loggedInUser): ?>
                <!-- BEGIN COMMENTS FORM -->
                    <form>
                      <div class="form-group">
                            <label for="comment_box">Add Comments</label>
                            <textarea class="form-control" id="comment_box" name="comments" rows="3"><?=Language::getText('comments')?></textarea>
                      </div>
                        <input type="hidden" name="videoId" value="<?=$video->videoId?>" />
                        <input type="hidden" name="parentCommentId" value="" />
                        <button type="submit" class="btn btn-primary"><?=Language::getText('comments_button')?></button>
                    </form>
    
                <!-- END COMMENTS FORM -->
            <?php else: ?>
                <?php if ($config->enableRegistrations): ?>
                    <p class="commentMessage"><?=Language::getText('comments_login_register', array('login_link' => HOST . '/login/?redirect=' . urlencode($this->getService('Video')->getUrl($video)), 'register_link' => HOST . '/register/'))?></p>
                <?php else: ?>
                    <p class="commentMessage"><?=Language::getText('comments_login', array('login_link' => HOST . '/login/?redirect=' . urlencode($this->getService('Video')->getUrl($video))))?></p>
                <?php endif; ?>
            <?php endif; ?>


