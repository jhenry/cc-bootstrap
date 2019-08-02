<?php $avatar = $this->getService('User')->getAvatarUrl($member); ?>
<div class="card mb-3">
  <div class="row no-gutters">
    <div class="col-md-4">
    <?php if($avatar): ?>
        <img src="<?=$avatar_thumb;?>" class="card-img" alt="Avatar image for <?=$member->username?>">
    <?php else: ?>
       <ion-icon class="card-img avatar" style="font-size: 128px;" name="person"></ion-icon> 
    <?php endif; ?>
        <p class="text-center"><button data-type="<?=$subscribe_text?>" data-user="<?=$video->userId?>" type="button" class="btn btn-outline-primary">Follow <?=$member->username?></button></p>
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <p class="card-text"><strong>Uploaded by </strong><a href="<?=HOST?>/members/<?=$member->username?>/"><?=$member->username?></a> on <?=date('m/d/Y', strtotime($video->dateCreated))?></p>
        <p class="card-text"> <strong><?=Language::getText('tags')?>:</strong>
                <?php foreach ($video->tags as $value): ?>
                    <a href="<?=HOST?>/search/?keyword=<?=$value?>" title="<?php echo htmlspecialchars($value); ?>"><?php echo htmlspecialchars($value); ?></a>&nbsp;&nbsp;
                <?php endforeach; ?>

        </p>
    <?php if (!empty($attachments)): ?>
        <p class="card-text"><strong><?=Language::getText('attachments')?>:</strong>
            <?php foreach ($attachments as $attachment): ?>
                <a
                    class="attachment"
                    href="<?php echo $this->getService('File')->getUrl($attachment); ?>"
                    title="<?php echo htmlspecialchars($attachment->name); ?> (<?php echo \Functions::formatBytes($attachment->filesize, 0); ?>)"
                >
                    <?php echo htmlspecialchars($attachment->name); ?> (<?php echo \Functions::formatBytes($attachment->filesize, 0); ?>)
                </a>
            <?php endforeach; ?>
        </p>
    <?php endif; ?>
        <p><?php echo htmlspecialchars($video->description); ?></p>
      </div>
    </div>
  </div>
</div>

