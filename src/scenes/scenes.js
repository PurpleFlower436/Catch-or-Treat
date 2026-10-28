

class GameOver extends Phaser.Scene {


    constructor() {
        super('game_over_screen');
    }

    preload () {

    }

    create() {
        
        this.game_over_panel = this.add.rectangle(200, 250, 320, 320, 0x2E1B4A);
        this.score_box = this.add.rectangle(200, 190, 200, 100, 0x120A1E).setStrokeStyle(3, 0xFFB02E);
        this.score_label = this.add.text(170, 110, 'Score', {fontSize: 28});
    
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
    }

    timeFormat(time) {

            
            
        
        const minutes = Math.floor(time/ 60);
    
        const seconds = Math.floor(time % 60);
    
        const padded_minutes = String(minutes).padStart(2, '0');
        const padded_seconds = String(seconds).padStart(2, '0');
        
        
        return `${padded_minutes}:${padded_seconds}`;

    }

    spawnCandies() {

        const random_candy_key = this.candy_keys[Math.floor(Math.random() * this.candy_keys.length)];
       
        const random_x = Phaser.Math.Between(45, 400-90);
       
        const candy = this.candies.create(random_x, 70, random_candy_key);

        candy.setVelocityY(Phaser.Math.Between(20, 120));



    }




    create() 
    {

        // 1. spawn the candies during a specific interval 
        // 2. make the candies spawn between the left edge and the right edge 
        // 3. make the candies fall downward 
        // 4. When the candies collide with the treat bag then we add +10 points to the score 
        // 5. if candies hit the bottom of the screen then we destroy them 
    
       
        const three_musketeers_candy = this.add.image(300, 300, '3_musketeers');
        
        const milky_way_candy = this.add.image(220, 340, 'milky_way_candy');

        const twix_candy = this.add.image(180, 360, 'twix');

        const hundred_grand_candy = this.add.image(160, 380, '100_grand');
        
      
        
        
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

        this.candy_keys = ['twix', 'milky_way_candy', '3_musketeers', '100_grand'];
       
        
        this.candies = this.physics.add.group();
            
        //})

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnCandies,
            callbackScope: this,
            loop: true
        });




    
    }
    
        onEvent() {
            
         //   this.timer -= 1
            this.timer_string_format.setText('Time:' + this.timeFormat(this.timer));
            
            if (this.timer == 0) {
                this.scene.start('game_over_screen');
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














    











