game.PlayerEntity = me.Entity.extend({
    init: function( x, y, settings){
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
    //choosing a velocity for the player
    this.body.setVelocity(5, 20);
    //keeps track of what direction your character is going in 
    this.facing = "right";
    this.now = new Date().getTime();
    this.lastHit = this.now;
    this.lastAttack = new Date().getTime(); 
    //the screen follows the player
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH)
    //thiks is making the player walk in a certain animation 
    this.renderable.addAnimation("idle", [78]); 
    this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80); 
    this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    
    this.renderable.setCurrentAnimation("idle");
    },
    //checking if the right key was pressed
    update: function(delta){
        this.now = new Date().getTime();
        if(me.input.isKeyPressed("right")){
            //adds to the position of my x by adding the velocity defined above in 
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth          
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);
            //this is telling it to switch
        }else if(me.input.isKeyPressed ("left")){
            this.facing = "left";
           this.body.vel.x -=this.body.accel.x * me.timer.tick;
           this.flipx(false);   
        }else{
            this.body.vel.x = 0;
        }
        
        if (me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
            this.body.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }
        
       
        
        if(me.input.isKeyPressed("attack")){
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
        
        
         
        me.colision.check(this, true, this.colliddeHandler.bind(this), true);
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    
    collideHandler: function(response){
      if(responnse.b.type==='EnemyBaseEntity'){
          var ydif = this.pos.y - response.b.y;
          var xdif = this.pos.x - response.b.x;
          
          if( ydif<-40 && xdif< 70 && xdif>-35){
              this.body.falling = false;
              this.body.vel.y = -1;
          }
          
            else if(xdif>-35 && this.facing==='right' && (xdif<0) ){
              this.body.vel.x = 0;
              this.pos.x = this.pos.x -1;
          }else if(xdif>70 && this.faacing==='left' && xdif>0){
              this.body.vel.x = 0;
              this.pos.x = this.pos.x +1;
          }
          if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit>= 400){
              console.log("tower Hit");
              this.lastHit = this.now;
              response.b.loseHealth();
          }
      }  
    }
});
//it is making the players base tower
game.PlayerBaseEntity = me.Entity.extend({
  inik : function (x, y, settings){
      this._super(me.Entity, 'init', [x, y, {
              image:"tower",
              width: 100,
              hieght: 100,
              spritewidth:"100",
              spriteheight:"100",
              getShape: function(){
                  return (new me.Rect(0, 0, 100, 70)).Polygon();
                  
              }
        }]);    
        //to say the tower his not been destroyed
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = 'PlayerBaseEntity';
        //making the buildings not burn 
         this.renderable.addAnimation("idle", [0]); 
         this.renderable.addAnimation("broken", [1]); 
         this.renderable.setCurrentAnimation("idle");
        
  },  
    update: function(delta){
        if(this.health<=0){
            this.broken = true; 
            //making the buildings not burn  
            this.renderable.setCurrentAnimation("broken"); 
        }
        this.body.update(delta);


        this._super(me.Entity, "update", [delta]);
        return true;
  },
  
       onCollision: function(){
           
       }
  
});
//making the enemy Base tower
game.EnemyBaseEntity = me.Entity.extend({
  inik : function (x, y, settings){
      this._super(me.Entity, 'init', [x, y, {
              image:"tower",
              width: 100,
              hieght: 100,
              spritewidth:"100",
              spriteheight:"100",
              getShape: function(){
                  return (new me.Rect(0, 0, 100, 70)).Polygon();
                  
              }
        }]);
        //to say the tower hss not been destroyed
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = 'EnemyBaseEntity';
        
         this.renderable.addAnimation("idle", [0]); 
         this.renderable.addAnimation("broken", [1]); 
         this.renderable.setCurrentAnimation("idle");
  },  
    update: function(delta){
        if(this.health<=0){
            this.broken = true;
            //this helps the building not burn 
            this.renderable.setCurrentAnimation("broken"); 
        }
        this.body.update(delta);


        this._super(me.Entity, "update", [delta]);
        return true;
  },
  
       onCollision: function(){
           
       },
       
       loseHealth: function (){
           this.health--;
       }
  
});

game.EnemyCreep = me.Entity.extend({
    init: function( x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
                image:"creep1",
                width: 32,
                height: 64,
                spritewidth:"32",
                spriteheight: "64",
                getShape: function(){
                   return(new me.Rect(0, 0, 64, 64)).toPolygon();   
                }        
        }]);
    this.health = 10;
    this.alwaysUpadte = true;
    
    this.setVelocity(3, 20);
    
    this.type = "EnnemyCreep";
    this.renderable.addAnimation("walk" , [3, 4, 5], 80);
    this.renderable.setCurrentAnimation 
}   
});
    //this.