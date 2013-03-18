import cherrypy
import sys

class CakeServer:
  pass

if not sys.flags.interactive:
  cherrypy.quickstart(CakeServer(), '/', 'server.conf')
