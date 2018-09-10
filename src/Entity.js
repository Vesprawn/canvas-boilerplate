module.exports = {
  Entity: function (config) {
    let self = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      w: 0,
      c: '#000',
      name: ''
    }

    function init (config) {
      config = config || {}
      self.x = config.x || 0
      self.y = config.y || 0
      self.vx = config.vx || 0
      self.vy = config.vy || 0
      self.w = config.w || 0
      self.name = config.name || ''
      self.c = config.c || '#000'
    }

    init(config)

    return self
  }
}
