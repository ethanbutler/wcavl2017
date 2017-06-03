(function($){

  $(document).on('ready', function(){

    var socket     = io(SOCKET_ENDPOINT)
    var $body      = $('body')
    var $container = $('.js-posts')

    // Handle new posts
    socket.on('POST_NEW', function(data){
      var $alert = $('<span class="alert-new">New Posts</span>')
      var html = `
        <article class="post--new post js-post" data-id="${data.id}">
          <div class="post-main">
            <header class="post-header">
              <h2 class="post-title">${data.title.rendered}</h2>
              <span class="post-author">${data.author}</span>
              <span class="post-date">${data.date}</span>
            </header>
            <div class="post-content">${data.content.rendered}</div>
          </div>
          <aside class="post-comments comments">
            <ul class="comments-list js-commentslist"></ul>
            <div class="commentNew">
              <textarea class="commentNew-input js-input" placeholder="Leave a comment"></textarea>
              <button class="commentNew-submit js-submit" type="submit">Submit</button>
            </div>
          </aside>
        </article>`

      $container.find('.js-noposts').remove()
      $container.prepend(html)

      $body.append($alert)

      setTimeout(function(){
        $alert.remove()
      }, 4000)

    })

    // Dismiss new post styling
    $body.on('mouseenter', '.post--new', function(){
      $(this).removeClass('post--new')
    })

    // Handle updated posts
    socket.on('POST_UPDATE', function(data){
      console.log(data)
      console.log('update')
      var $post = $(`[data-id="${data.id}"]`)

      $post.find('.post-editStatus').remove()
      $post.find('.post-dateEdit').remove()
      $post.find('.post-date').append(`<span class="post-dateEdit">(edited ${data.date} by ${data.author})</span>`)
      $post.find('.post-title').html(data.title.rendered || data.title)
      $post.find('.post-content').html(data.content.rendered || data.content)
      $post.addClass('post--updated').removeClass('post--isBeingEdited')

    })

    // Dismiss updated post styling
    $body.on('mouseenter', '.post--updated', function(){
      $(this).removeClass('post--updated')
    })

    // Handle posts being edited
    socket.on('POST_ALERT', function(data){
      var $post   = $(`[data-id="${data.id}"]`)
      var $status = $post.find('.post-editStatus')
      var html = `<span class="post-editStatus">${data.author} is editing this post</span>`

      $post.addClass('post--isBeingEdited')

      if($status.length){
        $status.replaceWith(html)
      }
      else {
        $post.append(html)
      }

    })

    // Handle new comments
    socket.on('COMMENT_NEW', function(data){
      var $commentsList = $(`[data-id="${data.post_id}"] .comments-list`)
      var html = `
        <li class="comment">
          <span class="comment-author">${data.user}</span>
          <span class="comment-date">${data.date}</span>
          <div class="comment-body">${data.content}</div>
        </li>`

      $commentsList.prepend(html)
      $commentsList.animate({scrollTop: 0}, 250)

    })

    // Handle other users typing comment
    socket.on('COMMENT_FOCUS', function(data){
      var $post     = $(`[data-id="${data.post_id}"]`)
      var $comments = $post.find('.commentNew')
      var $alert    = $comments.find('.commentNew-alert')
      var users     = $post.data('users') || []

      if(users.indexOf(data.user) < 0) users.push(data.user)
      else return

      $post.data('users', users)

      var html = `
        <span class="commentNew-alert">
          Writing comments: ${users.join(', ')}
        </span>`

      if($alert.length){
        $alert.replaceWith(html)
      } else {
        $comments.append(html)
      }

    })

    // Handle other users stopping typing comment
    socket.on('COMMENT_BLUR', function(data){
      var $post     = $(`[data-id="${data.post_id}"]`)
      var $comments = $post.find('.commentNew')
      var $alert    = $comments.find('.commentNew-alert')
      var users     = $post.data('users') || []

      if(users.indexOf(data.user) >= 0) users.splice(users.indexOf(data.user), 1)

      $post.data('users', users)

      if(users.length < 1) return $alert.remove()

      var html = `
        <span class="commentNew-alert">
          Writing comments: ${users.join(', ')}
        </span>`

      if($alert.length){
        $alert.replaceWith(html)
      } else {
        $comments.append(html)
      }

    })

    // Only do if user is logged in
    if(window.SOCKET_USER){

      // Handle user beginning typing comment
      $('body').on('focus', '.js-input', function(){
        var data = {
          post_id: $(this).closest('[data-id]').attr('data-id'),
          user:    window.SOCKET_USER
        }

        socket.emit('COMMENT_FOCUS', data)

      })

      // Handle user stopping typing comment
      $('body').on('blur', '.js-input', function(){
        var data = {
          post_id: $(this).closest('[data-id]').attr('data-id'),
          user:    window.SOCKET_USER
        }

        socket.emit('COMMENT_BLUR', data)
      })

      // Handle user submitting comment
      $('body').on('click', '.js-submit', function(){
        var input = $(this).siblings('.js-input')
        var data = {
          post_id: $(this).closest('[data-id]').attr('data-id'),
          user:    window.SOCKET_USER,
          content: input.val()
        }

        $.ajax(window.COMMENT_ENDPOINT, {
          data: JSON.stringify(data),
          type: 'POST',
          contentType: 'application/json',
          success: function(data){
            console.log(data)
          },
          error: function(err){
            console.log(err)
          }
        })
      })

    }

  })

})(jQuery)
