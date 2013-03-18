import cherrypy
import json
import random
import sys

slice_types = [3, 4, 5, 7, 8, 9, 10, 11]
cake_slices = sum((type*[type] for type in slice_types), [])
num_slices = 55

class CakeGame(object):
  def __init__(self, initial_status=None):
    self.players = {}
    self.slices = random.sample(cake_slices, num_slices)
    self.status = initial_status or 'Started new game.'

  def add_player(self, name):
    if name not in self.players:
      self.players[name] = {
        'points': 0,
        'slices': [],
      }
      self.status = '%s joined the game' % (name,)
      return True

  def to_dict(self):
    return {
      'players': self.players,
      'status': self.status
    }

class CakeServer(object):
  def __init__(self):
    self.game = CakeGame()

  @cherrypy.expose
  def do_command(self, command, name):
    command = self.tokenize(command)
    if not command:
      return self.return_value('You must enter a command.')
    elif command[0] == 'reset':
      if len(command) != 1:
        return self.return_value('Usage: reset')
      self.game = CakeGame('%s reset the game' % (name,))
      return self.return_value('Reset the game.')
    elif command[0] == 'join':
      if len(command) != 2:
        return self.return_value('Usage: join <username>')
      name = command[1]
      if self.game.add_player(name):
        return self.return_value('You joined the game as %s.' % (name,), name)
      return self.return_value('You are now playing as %s.' % (name,), name)

  def tokenize(self, s):
    tokens = s.split()
    tokens = [''.join(c for c in token if c.isalnum()) for token in tokens]
    return [token for token in tokens if token]

  def return_value(self, result, name=None):
    return json.dumps({
      'result': result,
      'game': self.game.to_dict(),
      'name': name,
    })

if not sys.flags.interactive:
  cherrypy.quickstart(CakeServer(), '/', 'server.conf')
