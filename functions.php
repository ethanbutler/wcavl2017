<?php

define('SOCKET_ENDPOINT', 'http://192.168.1.138:3000');

// Set up Hooky
// Normally, you'd run this as a plugin but it's bundled in theme for simplicity
require(get_stylesheet_directory() . '/lib/hooky/hooky.php');

// Enqueue scripts
add_action('wp_enqueue_scripts', function(){
  wp_enqueue_style('main/css', get_stylesheet_directory_uri() . '/style.css');
  wp_enqueue_script('socket.io/js', SOCKET_ENDPOINT . '/socket.io/socket.io.js', null, null, true);
  wp_enqueue_script('main/js', get_stylesheet_directory_uri() . '/app.js', ['jquery', 'socket.io/js'], null, true);
});

// Register custom REST endpoint with callback support
add_action('rest_api_init', function(){
  register_rest_route('ws/v1', '/comments', [
    'methods'  => 'POST',
    'callback' => function($req){
      $data = $req->get_json_params();
      $comment_id = wp_insert_comment([
        'comment_post_ID'  => $data['post_id'],
        'comment_author'   => $data['user'],
        'comment_content'  => $data['content'],
        'comment_approved' => 1
      ]);

      $callback = wp_remote_post(SOCKET_ENDPOINT . '/comment/new', [
        'headers' => ['Content-Type' => 'application/json; charset=utf-8'],
        'body'    => json_encode([
          'user'    => $data['user'],
          'content' => $data['content'],
          'post_id' => $data['post_id'],
          'date'    => date('g:i:sA, M j, Y')
        ])
      ]);

      return $callback;
    }
  ]);
});

add_action('wp_head', function(){
?>
  <script>
    var SOCKET_ENDPOINT  = '<?php echo SOCKET_ENDPOINT; ?>'
    var COMMENT_ENDPOINT = '<?php echo site_url() . '/wp-json/ws/v1/comments'; ?>'
    var SOCKET_USER      = '<?php echo wp_get_current_user()->user_login; ?>'
  </script>
<?php
});

add_action('admin_head', function(){
?>
  <script>
    var SOCKET_ENDPOINT = '<?php echo SOCKET_ENDPOINT; ?>';
    var SOCKET_USER     = '<?php echo wp_get_current_user()->user_login; ?>';
    var POST_ID         = <?php echo isset($_GET['post']) ? $_GET['post'] : 'null'; ?>;
  </script>
<?php
});

// Register alert button for WYSIWYG editor
add_action('mce_external_plugins', function($plugins){
  $plugins['socket_button'] = get_stylesheet_directory_uri() . '/admin.js';
  return $plugins;
});

add_filter('mce_buttons', function($buttons){
  $buttons[] = 'socket_button';
  return $buttons;
});
