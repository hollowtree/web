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

function Ball(x, y, velX, velY, color, size) {
    // --- 坐标
    this.x = x
    this.y = y
    // --- 速度
    this.velX = velX
    this.velY = velY

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

    balls.forEach(function (ball) {
        ball.draw()
        ball.update()
        ball.collisionDetect()
    })

    requestAnimationFrame(loop)
}

loop()
