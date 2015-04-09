


game.PlayerEntity = me.Entity.extend({
    init: function( x, y, settings){
       this.setSuper(x, y);
       this.setPlayerTimer();
       this.setAttributes();
       this.type = "PlayerEntity";
       this.setFlags();
         
    this.lastAttack = new Date().getTime(); 
    //the screen follows the player
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    
    this.addAnimation();
    
    this.renderable.setCurrentAnimation("idle");
    },
    
    setSuper: function(x, y){
        this._super(me.Entity, 'init', [x, y, {
                image:"player",
                width: 64,
                height: 64,
                spritewidth:"64",
                spriteheight: "64",
                getShape: function(){
                   return(new me.Rect(0, 0, 64, 64)).toPolygon();   
                }        
        }]); 
    },
    
    setPlayerTimer: function(){
        this.now = new Date().getTime();
        this.lastHit = this.now; 
        this.attack = game.data.playerAttack;
    },
    
    setAttributes: function(){
         this.health = game.data.playerHealth;
    //choosing a velocity for the player
         this.body.setVelocity(game.data.playerMoveSpeed, 20);
         this.attack = game.data.playerAttack;
    },
    
    setFlags: function(){
    //keeps track of what direction your character is going in 
    this.facing = "right";
    this.dead = false;
    this.attacking = false;
    
    },
    
    addAnimation: function(){
    //this is making the player walk in a certain animation 
    this.renderable.addAnimation("idle", [78]); 
    this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80); 
    this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    
    },
    
    //checking if the right key was pressed
    update: function(delta){
        this.now = new Date().getTime();           
        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();
        this.setAnimation();                   
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);      
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    checkIfDead: function(){
         
        if(this.health <= 0){
            return true;    
        }
        return false;
    },
    
    checkKeyPressesAndMove: function (){
          if(me.input.isKeyPressed("right")){
            this.moveRight();
            //this is telling it to switch
        }else if(me.input.isKeyPressed ("left")){
            this.moveLeft();
        }else{
            this.body.vel.x = 0;
        }
    
      if (me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
         this.jump();
        }
        this.attacking = me.input.isKeyPressed("attack");
    },
    
    moveRight: function(){
        //adds to the position of my x by adding the velocity defined above in 
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth          
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);
    },
    
    moveLeft: function(){
         this.facing = "left";
           this.body.vel.x -=this.body.accel.x * me.timer.tick;
           this.flipX(false);  
    },
    
    jump: function(){
            this.body.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
    },
    
    setAnimation: function (){
          if(this.attacking){
            if(!this.renderable.isCurrentAnimation("attack")){       
                console.log(!this.renderable.isCurrentAnimation("attack"));
                //sets the currentanimation to attack once that is over 
                //goes back to the idle animation 
                this.renderable.setCurrentAnimation("attack", "idle");
                //makes it so that the next time we begin
                //from the first animation, not wherever we left offwhen we 
                // switched to another animation
                this.renderable.setAnimationFrame();
               
            }
        }
        else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation('walk');
            }
        }else if(!this.renderable.isCurrentAnimation("attack")){
            this.renderable.setCurrentAnimation("idle");
        }
    },
    
    loseHealth: function(damage){
      this.health = this.health - damage; 
    },
    
    collideHandler: function(response){
      if(response.b.type==='EnemyBaseEntity'){
       this.collideWithBase(response);
      }else if (response.b.type==='EnemyCreep'){
          this.collideWithEnemyCreep(response);
       }  
    },
    
    collideWithEnemyBase: function(response){
              var ydif = this.pos.y - response.b.pos.y;
          var xdif = this.pos.x - response.b.pos.x;
          
          if( ydif<-40 && xdif< 70 && xdif>-35){
              this.body.falling = false;
              this.body.vel.y = -1;
          }
              else if(xdif>-35 && this.facing==='right' && (xdif<0) ){
              this.body.vel.x = 0;
             
          }else if(xdif>70 && this.facing==='left' && xdif>0){
              this.body.vel.x = 0;
             
          }
          if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit>= game.data.playerAttackTimer){
              console.log("tower Hit");
              this.lastHit = this.now;
              response.b.loseHealth(game.data.playerAttackTimer);
          }
    },
    
    collideWithEnemyCreep: function(response){      
          var xdif = this.pos.x - response.b.pos.x;
          var ydif = this.pos.y - response.b.pos.y;
        
        this.stopMovement(xdif);
        
        if(this.checkAttack(xdif, ydif)){
             //if the creeps health is  less than our attack exexute code in  if statement 
               this.hitCreep(response);
        };
      
      },
      
    stopMovement: function(xdif){
          if (xdif>0){
              this.pos.x = this.pos.x + 1;
              if (this.facing==="left"){
                  this.body.vel.x = 0;
              }
          }else{
            
               if (this.facing==="right"){
                  this.body.vel.x = 0;
              }
          }
      },
   
    checkAttack: function(xdif, ydif){
            //player can kill ccreeps
          if (this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit>= game.data.playerAttackTimer
                  && (Math.abs(ydif) <=40) && 
                  (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
                  ){
              console.log(response.b.health);
              this.lastHit = this.now;
             return true;
            }
            return false;
    },
            
    hitCreep : function (response){
         //if the creeps health is  less than our attack exexute code in  if statement 
                if (response.b.health <= game.data.playerAttack ){
                    //adds one gold for every creep kill
                    game.data.gold += 1;
                    console.log("current log:" + game.data.gold);
                }

                response.b.loseHealth(game.data.playerAttack);
    }
});




