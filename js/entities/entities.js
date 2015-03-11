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
    //thiks is making the player walk in a certain animation 
    this.renderable.addAnimation("idle", [78]); 
    this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80); 
    
    this.renderable.setCurrentAnimation("idle");
    },
    //checking if the right key was pressed
    update: function(delta){
        if(me.input.isKeyPressed("right")){
            //adds to the position of my x by adding the velocity defined above in 
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth          
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(true);
            //this is telling it to switch
           
        }else{
            this.body.vel.x = 0;
        }
        
        
        if(this.body.vel.x !== 0){
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation('walk');
            }
        }else{
            this.renderable.setCurrentAnimation("idle");
        }
        
        
        
        
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    }
});

game.PlayerBaseEntity = me.Entity.extend({
  inik : function (x, y, settings){
      this._super(me.Entity, 'init', [x, y, {
              image:"tower",
              width: 100,
              hieght: 100,
              spritewidth:"100",
              spriteheight:"100",
              getShape: function(){
                  return (new me.Rect(0, 0, 100, 100)).Polygon();
                  
              }
        }]);
        //to say the tower hss not been destroyed
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = 'PlayerBaseEntity';
        
  },  
    update: function(delta){
        if(this.health<=0){
            this.broken = true; 
        }
        this.body.update(delta);


        this._super(me.Entity, "update", [delta]);
        return true;
  },
  
       onCollision: function(){
           
       }
  
});

game.EnemyBaseEntity = me.Entity.extend({
  inik : function (x, y, settings){
      this._super(me.Entity, 'init', [x, y, {
              image:"tower",
              width: 100,
              hieght: 100,
              spritewidth:"100",
              spriteheight:"100",
              getShape: function(){
                  return (new me.Rect(0, 0, 100, 100)).Polygon();
                  
              }
        }]);
        //to say the tower hss not been destroyed
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = 'EnemyBaseEntity';
        
  },  
    update: function(delta){
        if(this.health<=0){
            this.broken = true; 
        }
        this.body.update(delta);


        this._super(me.Entity, "update", [delta]);
        return true;
  },
  
       onCollision: function(){
           
       }
  
});