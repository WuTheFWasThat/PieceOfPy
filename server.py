import cherrypy
import random
import sys

slice_types = [3, 4, 5, 7, 8, 9, 10, 11]
cake_slices = sum(type*[type] for type in slice_types, [])
num_slices = 55

class CakeGame(object):
  def __init__(self):
    self.players = {}
    self.slices = random.sample(cake_slices, num_slices)

  def add_player(self, name):
    if name not in self.players:
      self.players[name] = {
        'points': 0,
        'slices': []
      }
      return '%s joined the game' % (name,)
    return '%s is already playing'

class CakeServer(object):
  @cherrypy.expose
  def do_command(self, command):
    print command
    return {
      'result': command
    }

if not sys.flags.interactive:
  cherrypy.quickstart(CakeServer(), '/', 'server.conf')
