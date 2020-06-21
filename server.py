import cherrypy
import json
import random
import sys

slice_types = [3, 4, 5, 7, 8, 9, 10, 11]
cake_slices = sum((type*[type] for type in slice_types), [])
num_slices = 55
num_rounds = 5

class CakeGame(object):
  def __init__(self, last_resetter=None):
    self.players = {}
    self.slices = random.sample(cake_slices, num_slices)
    self.last_resetter = last_resetter
    self.state = 'waiting'

  def add_player(self, name):
    if self.state == 'waiting' and name not in self.players:
      self.players[name] = {
        'points': 0,
        'slices': [],
      }
      self.status = '%s joined the game' % (name,)
      return True

  def start(self):
    if self.state == 'waiting' and len(self.players) > 1:
      self.turn_order = random.sample(self.players.keys(), len(self.players))
      self.cur_player = self.turn_order[0]
      self.state = 'cut'
      self.round = 0
      return True

  def to_dict(self):
    return {
      'players': self.players,
      'status': self.get_status(),
      'cake': self.get_cake(),
    }

  def get_status(self):
    if self.state == 'waiting':
      if self.last_resetter:
        return '%s reset the game. Waiting for players...' % (self.last_resetter,)
      return 'Waiting for players...'
    elif self.state == 'cut':
      return "It is %s's turn to cut the cake." % (self.cur_player,)

  def get_cake(self):
    if self.state == 'waiting':
      return None
    n = num_slices/num_rounds
    return self.slices[n*self.round:n*(self.round + 1)]

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
      self.game = CakeGame(name)
      return self.return_value('Reset the game.')
    elif command[0] == 'join':
      if len(command) != 2:
        return self.return_value('Usage: join <username>')
      name = command[1]
      if self.game.add_player(name):
        return self.return_value('You joined the game as %s.' % (name,), name)
      return self.return_value('You are now playing as %s.' % (name,), name)
    elif command[0] == 'start':
      if len(command) != 1:
        return self.return_value('Usage: start')
      if self.game.start():
        return self.return_value('Started game!')
      if len(self.game.players) < 2:
        return self.return_value('Need two or more players to start a game.')
      return self.return_value('This game has already been started.')
    return self.return_value('Unexpected command %s.  Should be one of "reset", "join <username>" or "start"' % (command[0],))

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
