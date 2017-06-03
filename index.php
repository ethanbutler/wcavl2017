<!DOCTYPE html>
<html>
  <head>
    <?php wp_head(); ?>
  </head>
  <body>
    <main>
      <?php if(have_posts()): ?>
        <div class="js-posts">
          <?php while(have_posts()): the_post(); ?>
            <article class="post js-post" data-id="<?php the_ID(); ?>">
              <div class="post-main">
                <header class="post-header">
                  <h2 class="post-title"><?php the_title(); ?></h2>
                  <span class="post-author"><?php the_author(); ?></span>
                  <span class="post-date"><?= get_the_date('g:i:sA, M j, Y'); ?></span>
                </header>
                <div class="post-content">
                  <?php the_content(); ?>
                </div>
              </div>
              <aside class="post-comments">
                <ul class="comments-list">
                  <?php
                    $comments_query = new WP_Comment_Query;
                    $comments = $comments_query->query(['post_id' => get_the_ID()]);

                    foreach($comments as $comment):
                  ?>
                    <li class="comment">
                      <span class="comment-author"><?= $comment->comment_author; ?></span>
                      <span class="comment-date"><?= date('g:i:sA, M j, Y', strtotime($comment->comment_date)); ?></span>
                      <div class="comment-body"><?= $comment->comment_content; ?></div>
                    </li>
                  <?php endforeach; ?>
                </ul>
                <?php if(is_user_logged_in()): ?>
                  <div class="commentNew">
                    <textarea class="commentNew-input js-input" placeholder="Leave a comment"></textarea>
                    <button class="commentNew-submit js-submit" type="submit">Submit</button>
                  </div>
                <?php endif; ?>
              </aside>
            </article>
          <?php endwhile; ?>
        </div>
      <?php else: ?>
        <div class="posts-noPosts js-noposts">Sorry, no posts were found.</div>
      <?php endif; ?>
    </main>
    <?php wp_footer(); ?>
  </body>
</html>
