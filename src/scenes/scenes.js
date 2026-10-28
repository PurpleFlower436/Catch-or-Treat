

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
    }

    timeFormat(time) {

            
            
        
        const minutes = Math.floor(time/ 60);
    
        const seconds = Math.floor(time % 60);
    
        const padded_minutes = String(minutes).padStart(2, '0');
        const padded_seconds = String(seconds).padStart(2, '0');
        
        
        return `${padded_minutes}:${padded_seconds}`;

    }
    create() 
    {

        // 1. spawn the candies during a specific interval 
        // 2. make the candies spawn between the left edge and the right edge 
        // 3. make the candies fall downward 
        // 4. When the candies collide with the treat bag then we add +10 points to the score 
        // 5. if candies hit the bottom of the screen then we destroy them 
    
        // We move the treat bag with the left and right arrow keys.
        // the treat bag must stay between the bounds of left edge and right edge so it doesnt fall off the screen
        const three_musketeers_candy = this.add.image(300, 300, '3_musketeers');
    
    
        const treat_bag = this.add.rectangle(300, 554, 115, 90, 0x000000);
    
    
    
        this.movement_keys = this.input.keyboard.addKeys({
            'left': Phaser.Input.Keyboard.KeyCodes.left,
            'right': Phaser.Input.Keyboard.KeyCodes.right
        });
    
    
       

        this.timer = 120;
        this.timer_string_format = this.add.text(32, 32, 'Time:' + this.timeFormat(this.timer), {
            fontSize: '32px',
            fill: '#ffffff'
        });
    
        this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop: true
        });
    
    }
    
        onEvent() {
            
            this.timer -= 1
            this.timer_string_format.setText('Time:' + this.timeFormat(this.timer));
            
            if (this.timer == 0) {
                this.scene.start('game_over_screen');
            }
        }
    
    
    
    
    }

    update() 
    {
        /*
        if (this.movement_keys.left.isDown) {
            this.treat_bag.setVelocityX(-120);
        }
        else if (this.movement_keys.right.isDown) {
            this.treat_bag.setVelocityX(120);
        }
        else {
            this.treat_bag.setVelocityX(0);
        }

        */

        




    }
















    











