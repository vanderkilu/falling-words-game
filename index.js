(function () {
    const helpers = {
        
    }
    class Word {
        constructor(wordText) {
            this.word = null
            this.wordText = wordText
            this.left = 0
            this.create()
            this.setInitialPosition()
            this.attachListeners()          
        }
        create() {
            const word = document.createElement('div')
            word.className = 'word'
            const letters = this.wordText.split().map(letter => {
                return `<span class="letter">${letter}</span>`
            })
            word.innerHTML = letters
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
            this.word.parentNode.removeChild(this.word)
        }
        onLand() {
            this.destroy()
        }

    }

    class GameWorld {
        constructor() {
            this.wordMovetimer = null
            this.wordTexts = ['mango', 'apple', 'banana', 'orange']
            this.wordObjs = this.wordTexts.map(w => new Word(w))
        }
        attachListeners() {
            document.addEventListener('keypress', checkWordMatch)
        }
        start() {
            clearInterval(this.wordMoveTimer)
            this.wordMoveTimer = setInterval(()=> {
                const word = this.wordObjs.shift()
                if (!word) clearInterval(this.wordMoveTimer)
                else {
                    word.move()
                }
            }, 1000)
        }
    }

    const game = new GameWorld()
    game.start()
   
})()