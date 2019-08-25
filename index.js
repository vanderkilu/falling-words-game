(function () {
    const sounds = {
        'explosion': null,
        'click': null
    }
    const fallingWords = []
    const missiles = []
    
    class Word {
        constructor(wordText) {
            this.word = null
            this.wordText = wordText
            this.left = 0
            this.pos = 0
            this.create()
            this.setInitialPosition()
            this.attachListeners()

            this.missile = new Missile(this)
        }
        create() {
            const word = document.createElement('div')
            word.className = 'word'
            let wordHTML = ''
            this.wordText.split('').forEach(letter => {
                wordHTML += `<span class="letter">${letter}</span>`
            })
            word.innerHTML = wordHTML
            this.word = word

            const game = document.querySelector('#game')
            game.appendChild(word)
        }
        setInitialPosition() {
            const wordDim = this.word.getBoundingClientRect()
            const offset = 50
            let randomX = (Math.random() * window.innerWidth) - wordDim.width - offset
            if (randomX <= 0) {
                randomX += wordDim.width + offset
            }
            this.word.style.left = randomX + 'px'
        }
        move() {
            //generate a randomSpeed between 3 and 6
            const randomSpeed = Math.floor(Math.random() * 6) + 3
            this.word.style.transition = `all ${randomSpeed}s linear`
            this.word.classList.add('active')
        }
        attachListeners() {
            this.word.addEventListener('transitionend', this.onLand.bind(this))
        }
        destroy() {
            playSound('explosion')
            this.word.parentNode.removeChild(this.word)
        }
        onLand() {
            this.destroy()
        }
        isCompleted() {
            return this.wordText.length-1 === this.pos
        }
        getCurrentLetter() {
            return this.wordText.charAt(this.pos)
        }
    }

    class Missile {
        constructor (word) {
            this.left = 0
            this.missile = null
            this.word = word
            this.create()
        }
        create() {
            const game = document.querySelector('#game')
            const missile = document.createElement('img')
            missile.src= 'missile.svg'
            missile.className = 'missile'
            this.missile = missile
            game.appendChild(missile)
        }
        setLeftPosition() {
            const wordDim = this.word.word.getBoundingClientRect()
            this.missile.style.left = (wordDim.left + wordDim.width/2 ) + 'px' 
        }
        move() {
            this.setLeftPosition()
            const missileSpeed = 1.5
            this.missile.style.transition = `all ${missileSpeed}s linear`
            this.missile.classList.add('active')
        }
        checkCollision() {
            const missileDimTop = this.missile.getBoundingClientRect().top
            const wordDim = this.word.word.getBoundingClientRect()
            const wordDimMid = wordDim.top + wordDim.height/2

            if (missileDimTop < wordDimMid) {
                const index = missiles.indexOf(this.missile)
                missiles.splice(index, 1)
                this.destroy()
                this.word.destroy()
                createExplosion(wordDim.left, wordDim.top, wordDim.width)
            }
        }
        destroy() {
            this.missile.parentNode.removeChild(this.missile)
        }
    }

    function createAudio(fileName) {
        const audio = new Audio(`sounds/${fileName}.mp3`)
        sounds[fileName] = audio
    }

    function playSound(fileName) {
        const sound = sounds[fileName]
        sound.currentTime = 0
        sound.play()
    }
    function createAudios(fileNames) {
        for (fileName of fileNames) {
            createAudio(fileName)
        }
    }
    function checkCollisions() {
        if (missiles.length > 0) {
            for (missile of missiles) {
                missile.checkCollision()
            }
        } 
        requestAnimationFrame(checkCollisions)
    }

    function createExplosion(x, y, w) {
        const img = new Image(50,50)
        img.src = 'explosion.gif'
        img.className = 'explosion'

        img.style.left = x  + 'px'
        img.style.top = y + 'px'

        const game = document.querySelector('#game')
        game.appendChild(img)

        setTimeout(()=> game.removeChild(img), 800)

    }

    class GameWorld {
        constructor() {
            this.wordMovetimer = null
            this.wordTexts = ['mango', 'apple', 'banana', 'orange', 
                            'pineapple', 'pear', 'okro', 'cinnamon',
                            'pawpaw', 'citadel', 'money', 'freeze', 'argentina',
                            'willingly', 'freedom', 'focus', 'generate',
                            'succinitly', 'mannered', 'polysaccharide',
                            'snow', 'philipine', 'saturn', 'campaign',
                            'candidate', 'challenge', 'character', 'community',
                            ]
            this.wordObjs = this.wordTexts.map(w => new Word(w))
            this.attachListeners()
            createAudios(['explosion', 'tap'])
            checkCollisions()
        }
        attachListeners() {
            document.addEventListener('keydown', this.checkWordMatch.bind(this))
        }
        generateRandomWord() {
            const randomIndex = Math.floor(Math.random() * this.wordObjs.length)
            const word = this.wordObjs[randomIndex]
            this.wordObjs.splice(randomIndex, 1)
            return word
        }
        checkWordMatch(e) {
            playSound('tap')

            fallingWords.forEach((word) => {
                // check if our current word has all letters matched
                if (word.isCompleted()) {
                    const index = fallingWords.indexOf(word)
                    fallingWords.splice(index, 1)
                    word.missile.move()
                    missiles.push(word.missile)
                }

                const hasMatched = word.getCurrentLetter() === e.key
                const letters = word.word.childNodes
                if (hasMatched) {
                    letters[word.pos].classList.add('active')
                    word.pos += 1
                }
                else {
                    //reset position and 
                    // remove all active letters
                    word.pos = 0
                    for (let i = 0; i < letters.length; i++) {
                        letters[i].classList.remove('active')
                    }
                }
            })

        }
        start() {
            clearInterval(this.wordMoveTimer)
            this.wordMoveTimer = setInterval(() => {
                const word = this.generateRandomWord()
                if (!word) clearInterval(this.wordMoveTimer)
                else {
                    fallingWords.push(word)
                    word.move()
                }
            }, 3000)
        }

    }

    // const game = new GameWorld()
    // game.start()

})()