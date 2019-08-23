(function () {
    const sounds = {
        'explosion': null,
        'click': null
    }
    fallingWords = []
    const helpers = {
        
    }
    class Word {
        constructor(wordText) {
            this.word = null
            this.wordText = wordText
            this.left = 0
            this.pos = 0
            this.create()
            this.setInitialPosition()
            this.attachListeners()          
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

            const game  = document.querySelector('#game')
            game.appendChild(word)
        }
        setInitialPosition() {
            const wordDim = this.word.getBoundingClientRect()
            const offset = 50
            let randomX = (Math.random() * window.innerWidth) - wordDim.width-offset
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
            const index = fallingWords.indexOf(this.word)
            fallingWords.splice(index, 1)
            this.destroy()
        }
        isCompleted() {
            return this.wordText.length-1 === this.pos
        }
        getCurrentLetter() {
            return this.wordText.charAt(this.pos)
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

    class GameWorld {
        constructor() {
            this.wordMovetimer = null
            this.wordTexts = ['mango', 'apple', 'banana', 'orange']
            this.wordObjs = this.wordTexts.map(w => new Word(w))
            this.attachListeners()
            createAudios(['explosion', 'tap'])
        }
        attachListeners() {
            document.addEventListener('keydown', this.checkWordMatch.bind(this))
        }
        checkWordMatch(e) {
            // playSound('tap')

            fallingWords.forEach((word)=> {
                // check if our current word has all letters matched
                if (word.isCompleted()) {
                    const index = fallingWords.indexOf(word)
                    fallingWords.splice(index, 1)
                    word.destroy()
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
            this.wordMoveTimer = setInterval(()=> {
                const word = this.wordObjs.shift()
                if (!word) clearInterval(this.wordMoveTimer)
                else {
                    fallingWords.push(word)
                    word.move()
                }
            }, 1000)
        }
        
    }

    const game = new GameWorld()
    game.start()
   
})()