var name = '';

function onload() {
  $('#submit_command').click(submit_command);
  $('#command_input').keydown(function(e) {
    if (e && e.which == 13) {
      e.preventDefault();
      submit_command();
    }
  });
  submit_command();
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
      if (response.name) {
        name = response.name;
      }
      update_game_state(response.game);
    }
  );
}

function update_game_state(game_state) {
  $('#game_status').text(game_state.status);
  $('#game_state').empty();
  var row = $('<tr></tr>');
  row.append($('<td></td>').html('<b>Player</b>'));
  row.append($('<td></td>').html('<b>Points</b>'));
  row.append($('<td></td>').html('<b>3</b>'));
  row.append($('<td></td>').html('<b>4</b>'));
  row.append($('<td></td>').html('<b>5</b>'));
  row.append($('<td></td>').html('<b>7</b>'));
  row.append($('<td></td>').html('<b>8</b>'));
  row.append($('<td></td>').html('<b>9</b>'));
  row.append($('<td></td>').html('<b>10</b>'));
  row.append($('<td></td>').html('<b>11</b>'));
  $('#game_state').append(row);

  for (player in game_state.players) {
    if (game_state.players.hasOwnProperty(player)) {
      var slices = [null, null, null, 0, 0, 0, null, 0, 0, 0, 0, 0];
      var player_state = game_state.players[player];
      for (i in player_state.slices) {
        slices[player_state.slices[i]] += 1;
      }
      var row = $('<tr></tr>');
      row.append($('<td></td>').text(player));
      row.append($('<td></td>').text(player_state.points));
      for (i in slices) {
        if (slices[i] !== null) {
          if (slices[i] == 0) {
            row.append($('<td></td>'))
          } else {
            row.append($('<td></td>').text(slices[i]))
          }
        }
      }
      $('#game_state').append(row);
    }
  }
}

var colors = [null, null, null, '#FF99CC', '#FF3333', '#FFB266', null, '#FFFF99', '#00CC66', '#6666FF', '#990099', '']

function draw_slice(position, type) {
  var canvas = $('<canvas></canvas>')
  canvas.css('position', 'absolute');
  $('#drawing').append(canvas)
  canvas.height(200)
  canvas.width(400)

  var context = canvas[0].getContext('2d');
  var radius = 75;
  context.font = "bold 12px sans-serif";
  context.fillText(type, 100, 100);

  console.log(colors[type])
  context.fillStyle= colors[type];
  context.strokeStyle= colors[type];
  context.beginPath();
  context.moveTo(radius,radius);
  context.arc(radius,radius,radius, 2 * Math.PI * position / 11, 2 * Math.PI * (position + 1) / 11);
  context.lineTo(radius,radius);
  context.fill(); // or context.fill()
}

$(document).ready(function() {
  $('#drawing').width(200)
  $('#drawing').height(200)

  var game_state = {
    'shaunak': {points: 10, slices: [10, 11, 9, 3]},
    'jeff': {points: 10, slices: [10, 11, 9, 3, 3, 7, 7,]},
  }
  update_game_state(game_state);

  for (var i = 0; i < 12; i += 1) {
    if (colors[i] !== null) {
      draw_slice(i, i);
    }
  }

});
