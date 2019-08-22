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
            
        }
        create() {
            const word = document.createElement('div')
            word.className = 'word'
            const letters = this.wordText.split('').map(letter => {
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
            //generate a randomSpeed between 2 and 5
            const randomSpeed = Math.floor(Math.random() * 5) + 2
            this.word.style.transition = `all ${randomSpeed}s linear`
            this.word.classList.add('active')
        }

    }

    class GameWorld {
        constructor() {
            this.wordMoveTimer = null
            this.w = new Word('mango')
            // this.words = ['mango', 'apple', 'banana', 'orange']
            // this.wordObj = this.words.map(w => new Word(w))
        }
        start() {
            setTimeout(()=> this.w.move(), 300)
        }
    }

    const game = new GameWorld()
    game.start()
   
})()