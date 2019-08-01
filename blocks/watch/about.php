<?php $avatar = $this->getService('User')->getAvatarUrl($member); ?>
<?php $avatar_thumb = ($avatar) ? $avatar : $this->options->themeUrl . '/images/avatar.gif'?>
<div class="card mb-3" style="max-width: 540px;">
  <div class="row no-gutters">
    <div class="col-md-4">
    <img src="<?=$avatar_thumb;?>" class="card-img" alt="Avatar image for <?=$member->username?>">
    </div>
    <div class="col-md-6">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text"><strong><?=Language::getText('Uploaded by')?> </strong><a href="<?=HOST?>/members/<?=$member->username?>/"><?=$member->username?></a> <?=Language::getText('on')?> <?=date('m/d/Y', strtotime($video->dateCreated))?></p>
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
      </div>
    </div>
    <div class="col-md-2">
        <button data-type="<?=$subscribe_text?>" data-user="<?=$video->userId?>" type="button" class="btn btn-outline-primary">Follow <?=$member->username?></button>
    </div>
  </div>
</div>

<div class="row">
    <div class="col">
        <p><?php echo htmlspecialchars($video->description); ?></p>
  </div>
</div>
