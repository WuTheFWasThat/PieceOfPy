function onload() {
  $('#submit_command').click(submit_command);
  $('#command_input').keydown(function(e) {
    if (e && e.which == 13) {
      e.preventDefault();
      submit_command();
    }
  });
}

function submit_command() {
  $.post(
    'do_command',
    {'command': $('#command_input').val()},
    function(json) {
      var response = JSON.parse(json);
      $('#command_input').val('');
      $('#command_output').text(response.result);
    }
  );
}
