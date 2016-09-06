var global_post_id;

function toast(message) {
  $(".toast").text(message);
  $(".toast").fadeIn("slow")
  setTimeout(function() {
    $(".toast").fadeOut("slow");
  }, 5000);
}

function updatePost() {
  $.ajax({
    type: 'put',
    url: "/admin/posts/" + global_post_id,
    data: getPostData(),
    success: function(data) {
      toast("自动同步");
    },
    dataType: 'json'
  });
}

function newPost() {
  $.ajax({
    type: 'post',
    url: "/admin/posts/",
    data: getPostData(),
    success: function(data) {
      global_post_id = data._id;
      $('#submit-post').attr('href', '/admin/#nav:posts,method:put,_id:' + global_post_id);
      toast("自动创建");
    },
    dataType: 'json'
  });
}

function autoSave() {
  if (!$("#titleInput").val()) {
    return;
  }
  if (global_post_id) {
    updatePost();
  } else {
    newPost();
  }
}

var interval_id;
$("#auto-sync").change(function() {
  if ($("#auto-sync").is(':checked')) {
    interval_id = setInterval(autoSave, 60000);
  } else {
    clearInterval(interval_id);
  }
});
$("#auto-sync").change();