// setup canvas
var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

var width = canvas.width = window.innerWidth
var height = canvas.height = window.innerHeight

window.addEventListener('resize', function () {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
})

// function to generate random number
function random(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min
    return num
}

function Shape(x, y, velX, velY) {
    // --- 坐标
    this.x = x
    this.y = y
    // --- 速度
    this.velX = velX
    this.velY = velY

    this.exists = true
}

function EvilCircle(x, y) {
    var velX = 10
    var velY = 10
    var color = 'white'
    var size = 10
    Shape.call(this, x, y, velX, velY, color, size)
    this.color = color
    this.size = size
}
EvilCircle.prototype.draw = function () {
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = this.color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.stroke()
}
EvilCircle.prototype.checkBounds = function () {
    if (this.x + this.size >= width) {
        this.x -= this.size
    }
    if (this.x - this.size <= 0) {
        this.x += this.size
    }

    if (this.y + this.size >= height) {
        this.y -= this.size
    }
    if (this.y - this.size <= 0) {
        this.y += this.size
    }
}
EvilCircle.prototype.setControls = function () {
    var _this = this;
    window.onkeydown = function (e) {
        console.log(e.keyCode)
        
        if (e.keyCode === 37 || e.keyCode === 65) {
            // go left
            _this.x -= _this.velX;
        } else if (e.keyCode === 39 || e.keyCode === 68) {
            // go right
            _this.x += _this.velX;
        } else if (e.keyCode === 38 || e.keyCode === 87) {
            // go up
            _this.y -= _this.velY;
        } else if (e.keyCode === 40 || e.keyCode === 83) {
            // go down
            _this.y += _this.velY;
        }
    }
}
EvilCircle.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            var dx = this.x - balls[j].x
            var dy = this.y - balls[j].y
            var distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < this.size + balls[j].size) {
                balls[j].exists = false
            }
        }
    }
}

function Ball(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, velX, velY)
    this.color = color
    this.size = size
}
Ball.prototype.draw = function () {
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
}
Ball.prototype.update = function () {
    if (this.x + this.size >= width || this.x - this.size <= 0) {
        this.velX = -this.velX
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
        this.velY = -this.velY
    }
    this.x += this.velX
    this.y += this.velY
}
// --- 碰撞检测
Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x
            var dy = this.y - balls[j].y
            var distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')'
            }
        }
    }
}


var balls = []
var evilCircle = new EvilCircle(50, 50)
evilCircle.setControls()
function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, .25)'
    ctx.fillRect(0, 0, width, height)

    while (balls.length < 25) {
        var size = random(8, 16)
        var ball = new Ball(
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-7, 7),
            random(-7, 7),
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            size
        )
        balls.push(ball)
    }

    evilCircle.draw()
    evilCircle.checkBounds()
    evilCircle.collisionDetect()

    balls.forEach(function (ball, i) {
        if (ball.exists) {
            ball.draw()
            ball.update()
            ball.collisionDetect()
        }
    })

    requestAnimationFrame(loop)
}

loop()
