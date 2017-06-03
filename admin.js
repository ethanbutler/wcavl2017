(function($){
  tinymce.PluginManager.add('socket_button', function(editor){
    editor.addButton('socket_button', {
      icon: false,
      type: 'button',
      text: 'Alert',
      onclick: function(){
        var data = {
          id: POST_ID,
          author: SOCKET_USER
        };
        $.ajax(SOCKET_ENDPOINT+'/post/alert', {
          data: JSON.stringify(data),
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataype: 'json',
          success: function(){
            console.log('alert successful');
          }
        })
      }
    })

    // return

    editor.on('keydown', function(e){
      if(window.debounce) clearTimeout(debounce)

      window.debounce = setTimeout(function(){
        var content = tinymce.activeEditor.getContent()
        var data = {
          id: POST_ID,
          title: $('#title').val(),
          author: SOCKET_USER,
          date: '',
          content: content
        }
        console.log(data)
        $.ajax(SOCKET_ENDPOINT+'/post/update', {
          data: JSON.stringify(data),
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function(){
            console.log('content sent')
          }
        })
      }, 250)
    })
  })
})(jQuery);
