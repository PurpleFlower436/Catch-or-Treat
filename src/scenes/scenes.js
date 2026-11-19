/**
 * Title screen scene. Shows the game title, a short tagline, the controls,
 * and a Start button that launches the main game scene.
 */
class TitleScreen extends Phaser.Scene {
     /**
     * Registers this scene with Phaser under the key 'title_screen'
     * so other scenes can switch to it with this.scene.start('title_screen').
     */
    constructor() 
    {
        super('title_screen');
    }

    preload()
    {
        
    }
    
    /**
     * Builds the title screen UI: the purple panel, the game title, the
     * tagline, the controls text, and the Start button. Clicking Start
     * switches to the 'catch_treats_minigame' scene.
     */

    create()
    {
        this.game_over_panel = this.add.rectangle(300, 270, 450, 450, 0x2E1B4A);
        this.game_title = this.add.text(90, 170, 'CATCH OR TREAT', {fontSize: 50, color: '#FFB02E'});
        
        this.subheading = this.add.text(100, 220, 'Catch the candy, dodge the raisins!', {fontSize: 20}); 
        
        this.instructions = this.add.text(90, 260, 'Use the left and right arrow keys \nto move!', {fontSize: 22});
        
        this.add.text(230, 330, 'Start', {fontSize: '30px', fill:'#2A1208', backgroundColor: '#FFB02E'})
        .setPadding(30)
        .setInteractive({useHandCursor: true})
        
        .on('pointerdown', () => {
            this.scene.start('catch_treats_minigame');
        })
    }

    /**
     * Runs every frame. Currently empty because the title screen has
     * nothing that needs per-frame updates.
     */
    update()
    {

    }
}


/**
 * Main gameplay scene. Candies and hazards (apples and raisin boxes) fall
 * from the top of the screen, and the player moves a goody bag left and right
 * to catch candy for points while dodging the hazards. A countdown timer ends
 * the round and sends the player to the game over screen with their score and
 * a movie recommendation.
 */
class CatchTreats extends Phaser.Scene {

    /**
     * Registers this scene with Phaser under the key 'catch_treats_minigame'.
     */
    constructor ()
    {
        super('catch_treats_minigame');
    }

    /**
     * Loads every asset the game needs before create() runs: the background,
     * the four candy images, the goody bag, the two hazard images, and the
     * sound effects and background music.
     */
    preload ()
    {

        this.load.image('spooky_background', 'assets/spooky_background.jpg');

        this.load.image('3_musketeers', 'assets/3_musketeers.png');

        this.load.image('100_grand', 'assets/100_grand.png');

        this.load.image('milky_way_candy', 'assets/milky_way.png');

        this.load.image('twix', 'assets/twix.png');

        this.load.image('goody_bag', 'assets/trick_or_treat_goody-bag.png');

        this.load.image('apple', 'assets/apple.png');

        this.load.image('raisin_box', 'assets/raisin_box.png');

        this.load.audio('collect_candies_sound', 'assets/collect_candies_sound.mp3');
        
        this.load.audio('background_music', 'assets/background_music.mp3');

    }

    /**
     * Converts a number of seconds into a zero-padded "MM:SS" string
     * for the countdown display (for example, 70 becomes "01:10").
     *
     * @param {number} time - The time in seconds.
     * @returns {string} The formatted time as "MM:SS".
     */
    timeFormat(time) {
        const minutes = Math.floor(time/ 60);
    
        const seconds = Math.floor(time % 60);
    
        const padded_minutes = String(minutes).padStart(2, '0');
        const padded_seconds = String(seconds).padStart(2, '0');
    
        return `${padded_minutes}:${padded_seconds}`;

    }

    /**
     * Overlap callback that runs when the goody bag touches a candy.
     * Looks up the candy's point value from its texture key, destroys the
     * candy, plays the collect sound, adds the points to the score, and
     * refreshes the score text.
     *
     * @param {Phaser.Physics.Arcade.Sprite} player - The goody bag sprite.
     * @param {Phaser.Physics.Arcade.Sprite} candy - The candy that was caught.
     */

    collectCandies(player, candy ) {

        
        const candy_key = candy.texture.key;
        const candy_point_value = this.candies_to_score_[candy_key];
        
        candy.destroy();
        this.sound.play('collect_candies_sound');
        
       
        this.score += candy_point_value;
        this.updateScore(this.score);
  
    }

    /**
     * Overlap callback that runs when the goody bag touches a hazard
     * (apple or raisin box). Looks up the hazard's penalty from its texture
     * key, destroys the hazard, subtracts the penalty from the score, keeps
     * the score from going below zero, and refreshes the score text.
     *
     * @param {Phaser.Physics.Arcade.Sprite} player - The goody bag sprite.
     * @param {Phaser.Physics.Arcade.Sprite} enemy - The hazard that hit the bag.
     */
    hitByEnemies(player, enemy) {

        const enemy_key = enemy.texture.key;
        const enemy_point_value = this.enemies_to_score[enemy_key];
        
        enemy.destroy();
        
        this.score -= enemy_point_value;
        this.clampScore(this.score);
        this.updateScore(this.score);

    }

     /**
     * Keeps the score from going negative. If the score passed in is below
     * zero, the stored score is reset to 0; otherwise it does nothing.
     *
     * @param {number} score - The score after a penalty has been subtracted.
     */
    clampScore(score) {
        if (score < 0) {
            this.score = Math.max(0, score);
            
        }
    }

    /**
     * Called by the spawn timer once per second. Rolls a random number and
     * spawns a candy about half the time, or a hazard otherwise. Using one
     * timer for both means only one item appears per tick.
     */
    spawnItems() {
        const spawn_rate = Math.random();
        if (spawn_rate > 0.50 ) {
            this.spawnCandies();

        }
        else {
            this.spawnEnemies();
        }

    }

    /**
     * Spawns one random candy at the top of the screen. Picks a random candy
     * type and a random x position, adds it to the candies group, and applies
     * gravity so it speeds up as it falls.
     */
    spawnCandies() {

        this.random_candy_key = this.candy_keys[Math.floor(Math.random() * this.candy_keys.length)];
       
        const random_x = Phaser.Math.Between(45, 600-90);
       
        const candy = this.candies.create(random_x, 70, this.random_candy_key);

        candy.setGravityY(400);
        
    }

    /**
     * Spawns one random hazard (apple or raisin box) at the top of the screen.
     * Picks a random hazard type and a random x position, adds it to the
     * enemies group, and gives it a constant downward speed.
     */
    spawnEnemies() {

        this.random_enemy_key = this.enemies_keys[Math.floor(Math.random() * this.enemies_keys.length)];
       
        const random_x = Phaser.Math.Between(45, 600-90);
       
        const enemy = this.enemies.create(random_x, 70, this.random_enemy_key);

        enemy.setVelocityY(200);




    }

     /**
     * Updates the score text on screen so it shows the given score.
     *
     * @param {number} score - The score to display.
     */
    updateScore(score) {
        
        this.score_string_format.setText('Score:'+ `${score}`);
        
    }

    /**
     * Chooses a Halloween movie to recommend based on the player's final
     * score, stores it in this.movie_title, and returns it. The movies form a
     * ladder from gentlest to scariest as the score goes up, with no gaps:
     * under 150 gets "Hocus Pocus", 150-349 "Coraline", 350-599 "Talk to Me",
     * 600-799 "The Conjuring", and 800 or more gets "Scream VI". The cutoffs
     * are sized for the current point values and the 70-second round, so
     * adjust them if you change the scoring or the spawn rate.
     *
     * @param {number} score - The player's final score.
     * @returns {string} The title of the recommended movie.
     */
    movieRecommendations(score) {
        if ( score < 150) {
            this.movie_title = "Hocus Pocus";
        } else if (score < 350) {
            this.movie_title = "Coraline";
        } else if (score < 600) {
            this.movie_title = "Talk to Me";
        } else if (score < 800) {
            this.movie_title = "The Conjuring";
        } else { 
            this.movie_title = "Scream VI";
        }
        return this.movie_title;
    }

    /**
     * Sets up the game once assets are loaded: starts the background music,
     * draws the background, sets up the arrow keys, creates the goody bag
     * (with a hitbox around its opening, no gravity, and world bounds),
     * starts the 70-second countdown, defines the candy and hazard point
     * tables and groups, registers the overlap callbacks, creates the score
     * text, and starts the timer that spawns a new item every second.
     */
    create() 
    {
        
        this.sound.play('background_music', {volume: 0.2}); 
        this.add.image(0, 0, 'spooky_background').setOrigin(0,0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        
        this.movement_keys = this.input.keyboard.addKeys({
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT
        });
    
    
        this.player = this.physics.add.sprite(300, 500, 'goody_bag');

        this.player.body.setSize(100, 35);

        this.player.body.setOffset(70, 62);

        this.player.body.setAllowGravity(false);

        this.player.setCollideWorldBounds(true);    
        


        this.timer = 70;
        this.timer_string_format = this.add.text(10, 10, 'Time:' + this.timeFormat(this.timer), {
            fontSize: '32px',
            fill: '#2B0B3F'
        });
    
        this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop: true
        });

    
        this.candies_to_score_ = {'twix':50, 'milky_way_candy':20, '3_musketeers':15, '100_grand':20};
        this.candy_keys = Object.keys(this.candies_to_score_);
        
        this.candies = this.physics.add.group();

        this.physics.add.overlap(this.player, this.candies, this.collectCandies, null, this);
            
        this.enemies_to_score = {'apple': 70, 'raisin_box': 50};

        this.enemies_keys = Object.keys(this.enemies_to_score);

        this.enemies = this.physics.add.group();
        
        this.physics.add.overlap(this.player, this.enemies, this.hitByEnemies, null, this);

        this.score = 0;

        this.movie_title = "";
        
        this.score_string_format = this.add.text(450, 15, 'Score: 0', {
            fontSize: '25px',
            fill: '#2B0B3F'
        });


        this.time.addEvent({
            delay: 1000,
            callback: this.spawnItems,
            callbackScope: this,
            loop: true
        });

    }


    /**
     * Countdown tick that runs once per second. Decreases the timer by
     * one and updates the timer text. When the timer reaches 0, stops all
     * sounds, picks a movie recommendation from the score, and switches to
     * the game over screen, passing along the score and the movie title.
     */      

    onEvent() {
        
        this.timer -= 1
        this.timer_string_format.setText('Time:' + this.timeFormat(this.timer));
        
        if (this.timer == 0) {
            this.sound.stopAll();
            this.movieRecommendations(this.score);
            this.scene.start('game_over_screen', 
            {score: this.score, movie_title: this.movie_title
            });
        }
    }
    
        
    /**
     * Runs every frame. Moves the goody bag left or right at 300 pixels per
     * second while an arrow key is held (and stops it when neither is held),
     * and destroys any candy or hazard that has fallen past the bottom of the
     * screen so they don't pile up.
     */
    update() 
    {
       
        if (this.movement_keys.left.isDown) {
            this.player.setVelocityX(-300);
        }
        else if (this.movement_keys.right.isDown) {
            this.player.setVelocityX(300);
        }
        else {
            this.player.setVelocityX(0);
        }

        

        [...this.candies.getChildren()].forEach((candy) => {
            if (candy.y  + (candy.displayHeight / 2) >= 600) {
                candy.destroy();
            }
        });

        [...this.enemies.getChildren()].forEach((enemy) => {
            if (enemy.y + (enemy.displayHeight / 2) >= 600) {
                enemy.destroy();
            }
        });


    }

}

/**
 * Game over scene. Shows the player's final score, the recommended
 * Halloween movie, and a Play Again button that returns to the title screen.
 */
class GameOver extends Phaser.Scene {

    /**
     * Registers this scene with Phaser under the key 'game_over_screen'.
     */
    constructor() {
        super('game_over_screen');
    }

    /**
     * Receives the data passed from the gameplay scene when this scene starts
     * and saves the final score and movie title so create() can display them.
     *
     * @param {{score: number, movie_title: string}} data - The final score
     *     and the recommended movie title sent by CatchTreats.
     */
    init(data) {
       
        this.score = data.score;
        this.movie_title = data.movie_title;
    }


    /**
     * Runs before create(). Currently empty because this scene has no
     * assets of its own to load.
     */
    preload () 
    {

    }

    /**
     * Builds the game over screen: the purple panel, the score label and
     * score box, the movie recommendation box and label, and a Play Again
     * button that switches back to the title screen when clicked.
     */
    create() {
        
        this.game_over_panel = this.add.rectangle(300, 270, 450, 450, 0x2E1B4A);
        this.score_box = this.add.rectangle(300, 205, 300, 100, 0x120A1E).setStrokeStyle(3, 0xFFB02E);
        this.score_label = this.add.text(210, 110, 'Score', {fontSize: 50});
        
        this.score_string = this.add.text(190, 185, `${this.score}`, {fontSize: 40});
        
        this.movie_box = this.add.rectangle(300, 370, 300, 100, 0x20113A).setStrokeStyle(2, 0x5B3A8A);
        this.move_label = this.add.text(150,290, 'Your Halloween movie:', {fontSize: 25});
        
        
        this.movie_title_text = this.add.text(180, 360, `${this.movie_title}`, {fontSize: 40});

    

        this.add.text(220, 430, 'Play Again', {fontSize: '20px', fill:'#2A1208', backgroundColor: '#FFB02E'})
        .setPadding(20)
        .setInteractive({useHandCursor: true})
        
        .on('pointerdown', () => {
            this.scene.start('title_screen');
        })
    }

    /**
     * Runs every frame. Currently empty because the game over screen has
     * nothing that needs per-frame updates.
     */
    update() 
    {

    }

}











    











