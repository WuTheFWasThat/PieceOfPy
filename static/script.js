var name = '';

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
    {
      'command': $('#command_input').val(),
      'name': name,
    },
    function(json) {
      var response = JSON.parse(json);
      $('#command_input').val('');
      $('#command_output').text(response.result);
      if (result.name) {
        name = result.name;
      }
    }
  );
}

function update_game_state(game_state) {
  $('#game_state').empty();
  var row = $('<tr><tr>');
  row.append($('<td></td>').html('<b>Player</b>'))
  row.append($('<td></td>').html('<b>Points</b>'))
  row.append($('<td></td>').html('<b>3</b>'))
  row.append($('<td></td>').html('<b>4</b>'))
  row.append($('<td></td>').html('<b>5</b>'))
  row.append($('<td></td>').html('<b>7</b>'))
  row.append($('<td></td>').html('<b>8</b>'))
  row.append($('<td></td>').html('<b>9</b>'))
  row.append($('<td></td>').html('<b>10</b>'))
  row.append($('<td></td>').html('<b>11</b>'))
  $('#game_state').append(row);

  for (k in game_state) {
    var player = game_state
  }
}

$(document).ready(function() {
  var game_state = {
    'shaunak': {points: 10, pieces: [10, 11, 9, 3]},
    'jeff': {points: 10, pieces: [10, 11, 9, 3]},
  }
  update_game_state(game_state);

  var colors = [null, null, null, '#FF99CC', '#FF3333']
  var context = document.getElementById('drawing').getContext('2d');
  var radius = $('#drawing').height() / 2;
  var i = 0;
  var amount = 3;

  context.font = "bold 12px sans-serif";
  context.fillText(amount, 200, 200);

  context.fillStyle= colors[amount];
  context.strokeStyle= colors[amount];
  context.moveTo(radius,radius);
  context.arc(radius,radius,radius, 2 * Math.PI * i / 11, 2 * Math.PI * (i + 1) / 11);
  context.lineTo(radius,radius);
  context.fill(); // or context.fill()

});
