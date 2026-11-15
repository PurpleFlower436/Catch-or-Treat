
// whats left to finish up:
// 2. add spooky halloween music 
// 4. destroy candies and apples that fall at the bottom 
// 6. add the function that gives you the movie recommendation based on your score 



class TitleScreen extends Phaser.Scene {

    constructor() 
    {
        super('title_screen');
    }

    preload()
    {
        this.game_over_panel = this.add.rectangle(200, 250, 330, 330, 0x2E1B4A);
        this.game_title = this.add.text(60, 170, 'CATCH OR TREAT', {fontSize: 34, color: '#FFB02E'});
        
        this.subheading = this.add.text(50, 220, 'Catch the candy, dodge the raisins!', {fontSize: 15}); 
        
        this.instructions = this.add.text(50, 260, 'Use the left and right arrow keys \nto move!', {fontSize: 15});
        
        this.add.text(150, 330, 'Start', {fontSize: '20px', fill:'#2A1208', backgroundColor: '#FFB02E'})
        .setPadding(20)
        .setInteractive({useHandCursor: true})
        
        .on('pointerdown', () => {
            this.scene.start('catch_treats_minigame');
        })
    }
    

    create()
    {

    }

    update()
    {

    }





}













class CatchTreats extends Phaser.Scene {

    constructor ()
    {
        super('catch_treats_minigame');
    }

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
        this.sound.play('collect_candies_sound');
        
       
        this.score += candy_point_value;
        this.updateScore(this.score);
        
      
       
        
    }

    hitByEnemies(player, enemy) {

        const enemy_key = enemy.texture.key;
        const enemy_point_value = this.enemies_to_score[enemy_key];
        
        enemy.destroy();
        
        
        
        this.score -= enemy_point_value;
        this.changeScore(this.score);
        this.updateScore(this.score);



    }



    changeScore(score) {
        if (score < 0) {
            this.score = Math.max(0, score);
            
        }
    }


    spawnItems() {
        const spawn_rate = Math.random();
        console.log(spawn_rate);
        if (spawn_rate > 0.50 ) {
            this.spawnCandies();

        }
        else {
            this.spawnEnemies();
        }

    }


    spawnCandies() {

        

        this.random_candy_key = this.candy_keys[Math.floor(Math.random() * this.candy_keys.length)];
       
        const random_x = Phaser.Math.Between(45, 600-90);
       
        const candy = this.candies.create(random_x, 70, this.random_candy_key);

        candy.setVelocityY(200);

        
    }


    spawnEnemies() {

        this.random_enemy_key = this.enemies_keys[Math.floor(Math.random() * this.enemies_keys.length)];
       
        const random_x = Phaser.Math.Between(45, 600-90);
       
        const enemy = this.enemies.create(random_x, 70, this.random_enemy_key);

        enemy.setVelocityY(200);




    }


    updateScore(score) {
        
        this.score_string_format.setText('Score:'+ `${score}`);
        
    }




    create() 
    {

        this.add.image(0, 0, 'spooky_background').setOrigin(0,0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        
        this.movement_keys = this.input.keyboard.addKeys({
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT
        });
    
    
        this.player = this.physics.add.sprite(300, 554, 'goody_bag');


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

       

        
        this.score_string_format = this.add.text(480, 15, 'Score:', this.score, {
            fontSize: '40px',
            fill: '#2B0B3F'
        });


        this.time.addEvent({
            delay: 1000,
            callback: this.spawnItems,
            callbackScope: this,
            loop: true
        });

       

    }

        
    
        onEvent() {
            
            this.timer -= 1
            this.timer_string_format.setText('Time:' + this.timeFormat(this.timer));
            
            if (this.timer == 0) {
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











    











