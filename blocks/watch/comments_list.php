<!-- BEGIN COMMENTS LIST -->

<?php if ($commentCount > 0): ?>
    <?php foreach ($commentCardList as $commentCard): ?>
        <?php $commentIndentClass = getCommentIndentClass($commentCard->comment); ?>
<div class="card mb-3 comment <?=$commentIndentClass?>" data-comment="<?=$commentCard->comment->commentId?>">
              <div class="row no-gutters">
                  <div class="col-md-4">
                        <?php if($avatar): ?>
                            <img src="<?=$avatar_thumb;?>" class="card-img" alt="Avatar image for <?=$member->username?>">
                        <?php else: ?>
                           <ion-icon class="card-img avatar" style="font-size: 64px;" name="person"></ion-icon>
                        <?php endif; ?>
                            <p class="card-text commentAuthor"><a href="<?=getUserProfileLink($commentCard->author)?>"><?=$commentCard->author->username?></a></p>
                            <p class="card-text commentDate"><?=date('m/d/Y', strtotime($commentCard->comment->dateCreated))?></p>
                 </div>
             <div class="col-md-8">
                   <div class="card-body">
                       <p class="card-text"><?=nl2br($commentCard->comment->comments)?></p>
                        <?php if ($commentCard->comment->parentId != 0): ?>
                            <p class="card-text commentReply"><?=Language::getText('reply_to')?> <a href="<?=getUserProfileLink($commentCard->parentAuthor)?>"><?=$commentCard->parentAuthor->username?></a></p>
                        <?php endif; ?>
                                    <p class="card-text commentAction">
                                        <a class="reply" href=""><?=Language::getText('reply')?></a>
                                        <a class="flag" data-type="comment" data-id="<?=$commentCard->comment->commentId?>" href=""><?=Language::getText('report_abuse')?></a>
                                    </p>
                        <p>n</p>
              </div>
            </div>
          </div>
        </div>
<?php endforeach; ?>
                <?php else: ?>
                    <div id="no-comments" class="mt-4 alert alert-info"><?=Language::getText('no_comments')?></div>
                <?php endif; ?>


<?php if ($commentCount > 5): ?>
        <div class="loadMoreComments">
            <a href="" class="button" data-loading_text="<?=Language::getText('loading')?>"><?=Language::getText('load_more')?></a>
        </div>
<?php endif; ?>
<!-- END COMMENTS LIST -->
