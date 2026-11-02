
// whats left to finish up:
// 1. rewrite the candy add points code so it uses lookup table 
// 2. add spooky halloween music 
// 3. finish title screen 
// 4. destroy candies and apples that fall at the bottom 
// 5. add background 



class CatchTreats extends Phaser.Scene {

    constructor ()
    {
        super('catch_treats_minigame');
    }

    preload ()
    {
        this.load.image('3_musketeers', 'assets/3_musketeers.png');

        this.load.image('100_grand', 'assets/100_grand.png');

        this.load.image('milky_way_candy', 'assets/milky_way.png');

        this.load.image('twix', 'assets/twix.png');

        this.load.image('goody_bag', 'assets/trick_or_treat_goody-bag.png')

        this.load.image('apple', 'assets/apple.png');
        this.load.image('raisin_box', 'assets/raisin_box.png')

        this.load.audio('collect_candies_sound', 'assets/collect_candies_sound.wav');

     //   this.load.audio('hit_by_enemies_sound', 'assets/hit_by_enemy_sound.mp3');


    }

    timeFormat(time) {

            
            
        
        const minutes = Math.floor(time/ 60);
    
        const seconds = Math.floor(time % 60);
    
        const padded_minutes = String(minutes).padStart(2, '0');
        const padded_seconds = String(seconds).padStart(2, '0');
        
        
        return `${padded_minutes}:${padded_seconds}`;

    }


    collectCandies(player, candy ) {

        const candy_key = candy.texture.key;
        const candy_point_value = this.candies_to_score_[candy_key];
        candy.destroy();
        
       
        this.score += candy_point_value;
        this.updateScore(this.score);
        
      
       
        
    }

    hitByEnemies(player, enemy) {
        
        enemy.destroy();
        if (enemy.texture.key == 'apple') {
            this.score -= 30;
            if (this.score < 0) {
                this.score = Math.max(0, this.score);

            }
            this.updateScore(this.score);
        //    this.sound.play('hit_by_enemies_sound');
        }
        else {
            this.score -= 15;
            this.updateScore(this.score);
        //    this.sound.play('hit_by_enemies_sound');
        }
    }

    changeScore(score) {
        if (score < 0) {
            this.score = Math.max(0, score);
            
        }
    }




    spawnCandies() {

        

        this.random_candy_key = this.candy_keys[Math.floor(Math.random() * this.candy_keys.length)];
       
        const random_x = Phaser.Math.Between(45, 400-90);
       
        const candy = this.candies.create(random_x, 70, this.random_candy_key);

        candy.setVelocityY(120);

        
    }


    spawnEnemies() {

       
        this.random_enemy_key = this.enemies_keys[Math.floor(Math.random() * this.enemies_keys.length)];

        const random_x = Phaser.Math.Between(45, 400 - 90);

        const enemy = this.enemies.create(random_x, 70, this.random_enemy_key);

        enemy.setVelocityY(120);

        





    }

    updateScore(score) {
        
        this.score_string_format.setText('Score:'+ `${score}`);
        
    }




    create() 
    {

     
        
        this.movement_keys = this.input.keyboard.addKeys({
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT
        });
    
    
        this.player = this.physics.add.sprite(300, 554, 'goody_bag');


        this.player.setCollideWorldBounds(true);

        this.timer = 120;
        this.timer_string_format = this.add.text(10, 10, 'Time:' + this.timeFormat(this.timer), {
            fontSize: '32px',
            fill: '#ffffff'
        });
    
        this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop: true
        });

       // this.candy_keys = ['twix', 'milky_way_candy', '3_musketeers', '100_grand'];
       
        this.candies_to_score_ = {'twix':50, 'milky_way_candy':20, '3_musketeers':15, '100_grand':20};
        this.candy_keys = Object.keys(this.candies_to_score_);
        
        this.candies = this.physics.add.group();

        this.physics.add.overlap(this.player, this.candies, this.collectCandies, null, this);
            
        this.enemies_keys = ['apple', 'raisin_box'];

        this.enemies = this.physics.add.group();
        
        this.physics.add.overlap(this.player, this.enemies, this.hitByEnemies, null, this);

        this.score = 0;

        
        this.score_string_format = this.add.text(265, 30, 'Score:', this.score);
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnCandies,
            callbackScope: this,
            loop: true
        });


     //   this.time.addEvent({
     //       delay:1000,
     //       callback:this.spawnEnemies,
     //       callbackScope:this,
     //       loop:true
     //   });

        
    }
    
        onEvent() {
            
            this.timer -= 1
            this.timer_string_format.setText('Time:' + this.timeFormat(this.timer));
            
            if (this.timer == 0) {
                console.log(this.score);
                this.scene.start('game_over_screen', this.score);
            }
        }
    
        
    
    
    

    update() 
    {
        
        if (this.movement_keys.left.isDown) {
            this.player.setVelocityX(-120);
        }
        else if (this.movement_keys.right.isDown) {
            this.player.setVelocityX(120);
        }
        else {
            this.player.setVelocityX(0);
        }

        

        




    }

}


class GameOver extends Phaser.Scene {


    constructor() {
        super('game_over_screen');
    }


    init(data) {
       
        this.score = data;
    }



    preload () {

    }

    create() {
        
        this.game_over_panel = this.add.rectangle(200, 250, 320, 320, 0x2E1B4A);
        this.score_box = this.add.rectangle(200, 190, 200, 100, 0x120A1E).setStrokeStyle(3, 0xFFB02E);
        this.score_label = this.add.text(160, 110, 'Score', {fontSize: 28});
        
        this.score_string = this.add.text(170, 175, `${this.score}`, {fontSize: 40});
        
        this.movie_box = this.add.rectangle(200, 325, 230, 60, 0x20113A).setStrokeStyle(2, 0x5B3A8A);
        this.move_label = this.add.text(100,272, 'Your Halloween movie:', {fontSize: 14});
    
        this.add.text(150, 370, 'Play Again', {fill:'#FFB02E'})
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            this.scene.start('title_screen');
        })
    }

    update() 
    {

    }

}











    











