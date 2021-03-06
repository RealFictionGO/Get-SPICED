import kaboom from "kaboom"
// initialize context
kaboom({
  fullscreen: true,
  scale: 3
})

const FLOOR_HEIGHT = 48;
let JUMP_FORCE = 0;
let SPEED = 300;
let last_SPEED = 300;
//let pepperCount = 0
let over = false
let run = true
let pepperBoost = 1
let hp = 3
let last_hp = 0
let angry = false
let angryTime = 0

let score = 0;

const textes = ["Good job", "Ones more", "Another bites...", "THAT CLOSE"]

loadRoot('/sounds/')
loadSound("hurt", "hurt.mp3")
loadSound("wining", "wining.mp3")
loadSound("angry", "angry.mp3")
loadSound("boostup", "boostup.mp3")
loadSound("gold", "gold.mp3")
loadSound("eat", "eat.mp3")
loadSound("fury", "fury.mp3")
loadSound("hpup", "hpup.mp3")
loadSound("smiling", "smiling.mp3")
loadSound("talk", "talk.mp3")
loadSound("wining", "wining.mp3")
// load assets
loadRoot('/sprites/')
loadSprite("253", "253.png")
loadSprite("crown", "crown.png")
loadSprite("hu", "holoup.png")
loadSprite("pepper", "pepper.png")
loadSprite("goldenpepper", "goldenpepper.png")
loadSprite("hpepper", "holy pepper.png")
loadSprite("htaco", "holotacos.png")
loadSprite("hcook", "holocook.png")
loadSprite("taco", "tacos.png")
loadSprite("cloud", "cloud.png")
loadSprite("back", "back.png")
loadSprite("htp", "howtoplay.png")
loadSprite("story", "story.png")
loadSprite("tp", "trophy.png")
loadSprite("key", "space.png")
loadSprite("hp", "hearth.png")
loadSprite("fury", "angrycookboost.png")
loadSprite("morehp", "hpboost.png")
loadSprite("arcade", "arcade.png")
loadSprite("pepCount", "pepperboost.png")
loadSprite("logo", "sicklogo.png")
loadSprite("am", "arcademode.png")
loadSprite("er", "endless.png")
loadSprite("Cookwalkright", "Cookwalkright.png", {
  sliceX: 16,
	// Define animations
	anims: {
		"idle": 0,
      
		"run": {
			from: 2,
			to: 5,
			speed: 10,
			loop: true,
		},

    "talk":{
      from: 0,
      to: 1,
      speed: 10,
      loop: true,
      },
		// This animation only has 1 frame
		"jump": 6,

    "over": 7,

    "angry_run": {
      from: 8,
      to: 11,
      speed: 15,
      loop: true,
    },

    "angry_jump" : 12,

    "angry_over" : 13,

    "angry_idle" : 14,

    "smile" : 15,
	},
})

scene("game", () => {

  add([
    rect(width() * 2, height() * 2),
    pos(-width()/2,-height()/2),
    color(172,146,115)
  ])

	// define gravity
	gravity(2400);

	// add a game object to screen
	const player = add([
		// list of components
		sprite("Cookwalkright"),
		pos(80, 40),
    scale(2,2),
		area(),
		body(),
	]);

  player.play('run')
	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(1),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(179, 117, 65),
	]);

  add([
    sprite("fury"),
    area(),
    pos(48,height() - 40),
    "fury"
  ])

  onClick("fury", () => {
    if(score >= 10 && over == false){
      play("fury")
      if(player.isGrounded()){
        player.play("angry_run")
      }
      else{
        player.play("angry_jump")
      }
      last_SPEED = SPEED
      SPEED = 400
      score -= 10
      angry = true
      last_hp = hp
      hp += 20
      angryTime = 10
    }
  })

  add([
    sprite("morehp"),
    area(),
    pos(112, height() - 40),
    "hp"
  ])

  onClick("hp", () => {
    play("hpup")
    if(score >= 10 && over == false){
      score -= 10
      if(angry == true){
        last_hp += 1
      }
      else{
        hp += 1
      }
    }
  })

  add([
    sprite("pepCount"),
    area(),
    pos(176, height() - 40),
    "pep"
  ])

  onClick("pep", () => {
    if(score >= 20 && over == false){
      play("boostup")
      score -= 20
      pepperBoost *= 2
    }
  })
  

	function jump() {
		if (player.isGrounded() && over == false) {
			player.jump(JUMP_FORCE);
      run = false
      if(angry == true){
        player.play('angry_jump')
      }
      else{
        player.play('jump')
      }
      JUMP_FORCE = 0
		}
	}

  function add_jump(){
    if(JUMP_FORCE < 800){
      JUMP_FORCE += 100
    }
  }

	// jump when user press space
	onKeyDown("space", add_jump);
	//onClick(add_jump);
  onKeyRelease("space", jump)

	function spawnTree() {
    if(over == false && score < 253){
		// add tree obj
    rh = rand(1,2.5)
		add([
			sprite("taco"),
      scale(1,rh),
      outline(1),
			area(),
			pos(width(), height() - FLOOR_HEIGHT),
			origin("botleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			"tree",
		]);

    add([
      sprite('pepper'),
      area(),
      scale(2,2),
      pos(width() + 10, height() - 74 - (32 * rh)),
      origin("botleft"),
      move(LEFT, SPEED),
      "pepper"
    ]);

		// wait a random amount of time to spawn next tree
		wait(rand(1, 1.3), spawnTree);
    }
	}

	// start spawning trees
  wait(2, spawnTree)
	//spawnTree();
  
	const scoreLabel = add([
		text(score),
    scale(0.5,0.5),
		pos(width() - 64, 16),
	]);

  const boostCounting = add([
    text(`x ${pepperBoost}`),
    scale(0.3,0.3),
    pos(scoreLabel.pos.x + 40,scoreLabel.pos.y + 23)
  ])

  add([
    text("x"),
    scale(0.2,0.2),
    pos(boostCounting.pos.x - 6, boostCounting.pos.y + 6)
  ])

  const hpCounter = add([
    text(hp),
    scale(0.5,0.5),
    pos(40,8)
  ])

  add([
    sprite("hp"),
    pos(8,8)
  ])
	// lose if player collides with any game obj with tag "tree"
	player.onCollide("tree", () => {
		// go to "lose" scene and pass the score
    play("hurt")
		shake();
    if(over == false){
      hp -= 1
    }
    if(hp <= 0){
      over = true
    }
	});

  player.onCollide("pepper", (p) => {
    play("eat")
    destroy(p);
		score += 1 * pepperBoost;
  })

  player.onCollide("gp", (gp) => {
    play("gold", {
      volume: 0.2
    })
    destroy(gp);
    wait(3,() => {
        go("win")
      })
  })

	// keep track of score

	// increment score every frame
	onUpdate(() => {
    if(score >= 253){
      add([
        sprite("goldenpepper"),
        area(),
        pos(width(), height() - 48 - Math.floor(Math.random() * 20)),
        move(LEFT, SPEED),
        "gp"
      ])
    }
    boostCounting.text = pepperBoost;
    
    if(SPEED < 500){
      SPEED += 0.02;
    }
    if(angry == true && angryTime > 0){
      angryTime -= 1/60
    }
    else if(angry == true && angryTime <= 0){
      angry = false
      hp = last_hp
      SPEED = last_SPEED
    }
		scoreLabel.text = score;
    hpCounter.text = hp
    if(over == true){
      if(angry == true){
        player.play("angry_over")
      }
      else{
        player.play('over')
      }
      wait(2,() => {
        go("lose", score)
      })
    }
    else if(player.isGrounded() && run == false){
      run = true
      if(angry == true){
        player.play("angry_run")
      }
      else{
        player.play('run')
      }
    }
	});

});

scene("win", () => {
  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ])
  over = false;
  pepperBoost = 1
  pepperCount = 0;
  hp = 3
  const player = add([
		sprite("Cookwalkright"),
		pos(width() / 2 - 10, height() / 2 - 40),
		scale(2),
		origin("center"),
	]);

  player.play("talk")
  play("wining")

  add([
    sprite("goldenpepper"),
    pos(player.pos.x + 15, player.pos.y + 5),
    
  ])

  onKeyPress("space", () => go("menu"))
  add([
    sprite("back"),
    area(),
    pos(width() - 100, height() - 30),
    "b"
  ])

  add([
    text("My SPICE POWERS released their potentials"),
    pos(width() / 3 + 8, height() / 2),
    scale(0.1,0.1),
    color(206,206,28)
  ])

  add([
    text("However my tongue is kinda burnt now"),
    pos(width() / 3 + 20, height() / 2 + 10),
    scale(0.1,0.1)
  ])

  add([
    text("Whatever, don't forget to gather you own vitamin powers"),
    pos(width() / 3 - 20, height() / 2 + 20),
    scale(0.1,0.1)
  ])

  add([
    text("And thanks for playing!"),
    pos(width() / 2 - 56 , height() / 2 + 30),
    scale(0.1,0.1)
  ])

  add([
    text("May the pepper spice be with you"),
    pos(width() / 3 + 24, height() / 2 + 40),
    scale(0.1,0.1),
    color(206,44,28)
  ])

  add([
    sprite("tp"),
    pos(width() - 48, 10),
    area(),
    "trophy"
  ])

  onClick("trophy", () => go("victory"))
  
  onClick("b", () => go("menu"))
})

scene("victory", () => {
  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ])
  const player = add([
		sprite("Cookwalkright"),
		pos(width() / 2 - 10, height() / 2 - 40),
		scale(2),
		origin("center"),
	]);
  player.play("smile")

  add([
    sprite("crown"),
    pos(player.pos.x - 32, player.pos.y - 28),
    rotate(-45),
  ])

  add([
    sprite("goldenpepper"),
    pos(player.pos.x + 15, player.pos.y + 5)
  ])
  play("smiling")
  
  add([
  	text(score),
  	pos(width() / 2 - 8 , height() / 2 + 30),
		origin("center"),
    scale(0.6,0.6),
    color(230,194,35)
  	]);
  score = 0;

  add([
    sprite("back"),
    area(),
    pos(width() / 2 - 40, height() - 30),
    "b"
  ])

  onClick("b", () => go("menu"))
  
})

scene("lose", () => {
  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ])
  over = false;
  pepperBoost = 1
  pepperCount = 0;
  hp = 3
	const player = add([
		sprite("Cookwalkright"),
		pos(width() / 2 - 10, height() / 2 - 40),
		scale(2),
		origin("center"),
	]);

  if(angry == true){
    player.play("angry_idle")
  }
  else{
    player.play("idle");
  }
  play("angry")
  txt = textes[Math.floor(Math.random() * textes.length)]
  const cloud = add([
    sprite("cloud"),
    scale(txt.length / 5,1.5),
    pos(player.pos.x + 30, player.pos.y - 48)
  ])

  add([
    text(txt),
    pos(cloud.pos.x + 8, cloud.pos.y + 18),
    scale(0.1,0.1)
  ])
	// display score
	add([
		text(score),
		pos(width() / 2 - 8 , height() / 2 + 30),
		origin("center"),
    scale(0.6,0.6)
	]);

  score = 0;

  add([
    sprite("key"),
    pos(width() / 2 - 30, 180)
  ])

  add([
    text("Press"),
    pos(width() / 2 - 70, 180),
    scale(0.15,0.15)
  ])

  add([
    text("to play"),
    pos(width() / 2 + 20, 180),
    scale(0.15,0.15)
  ])

  add([
    sprite("back"),
    area(),
    pos(width() - 100, 175),
    "b"
  ])

  onClick("b", () => go("menu"))
	// go back to game with space is pressed
	onKeyPress("space", () => go("game"));
	//onClick(() => go("game"));

});

scene("menu", () => {
  score = 0
  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ])
  add([
    sprite("logo"),
    pos(width() / 2 - 130,-20),
    scale(2,2)
  ]) // press play text and sprite

  add([
    sprite("key"),
    pos(width() / 2 - 30, height() / 1.5 + 10)
  ])

  add([
    text("Press"),
    pos(width() / 2 - 70, height() / 1.5 + 10),
    scale(0.15,0.15)
  ])

  add([
    text("to play"),
    pos(width() / 2 + 20, height() / 1.5 + 10),
    scale(0.15,0.15)
  ])

  add([
    sprite("htp"),
    pos(width() / 2 - 130, height() / 1.5),
    area(),
    "htp"
  ])

  onClick("htp", () => go("howtoplay"))

  add([
    sprite("story"),
    pos(width() / 2 + 90, height() / 1.5),
    area(),
    "lore"
  ])

  onClick("lore", () => go("lores"))

  add([
    sprite("arcade"),
    pos(width() - 48, 40),
    origin("botleft"),
    area(),
    "ar"
  ])

  onClick("ar", () => go("arcademenu"))

  onKeyPress("space", () => go("game"));
})

scene("arcademenu", () => {
  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ]);

  add([
    sprite("back"),
    area(),
    pos(width() / 2 - 40, height() - 30),
    "b"
  ]);

  add([
    sprite("am"),
    pos(width() / 4 + 16, height() / 3),
    scale(1.5,1.5)
  ])

  add([
    sprite("er"),
    pos(width() / 3 + 16, height() / 2),
  ])

add([
    sprite("key"),
    pos(width() / 2 - 30, height() / 1.5 + 10)
  ])

  add([
    text("Press"),
    pos(width() / 2 - 70, height() / 1.5 + 10),
    scale(0.15,0.15)
  ])

  add([
    text("to play"),
    pos(width() / 2 + 20, height() / 1.5 + 10),
    scale(0.15,0.15)
  ])

  onKeyPress("space", () => go("arcadegame"))

  onClick("b", () => go("menu"))
})

scene("arcadegame", () => {

  add([
    rect(width() * 2, height() * 2),
    pos(-width()/2,-height()/2),
    color(172,146,115)
  ])

	// define gravity
	gravity(2400);

	// add a game object to screen
	const player = add([
		// list of components
		sprite("Cookwalkright"),
		pos(80, 40),
    scale(2,2),
		area(),
		body(),
	]);

  player.play('run')
	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(1),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(179, 117, 65),
	]);

  add([
    sprite("fury"),
    area(),
    pos(48,height() - 40),
    "fury"
  ])

  onClick("fury", () => {
    if(score >= 10 && over == false){
      play("fury")
      if(player.isGrounded()){
        player.play("angry_run")
      }
      else{
        player.play("angry_jump")
      }
      last_SPEED = SPEED
      SPEED = 400
      score -= 10
      angry = true
      last_hp = hp
      hp += 20
      angryTime = 10
    }
  })

  add([
    sprite("morehp"),
    area(),
    pos(112, height() - 40),
    "hp"
  ])

  onClick("hp", () => {
    play("hpup")
    if(score >= 10 && over == false){
      score -= 10
      if(angry == true){
        last_hp += 1
      }
      else{
        hp += 1
      }
    }
  })

  add([
    sprite("pepCount"),
    area(),
    pos(176, height() - 40),
    "pep"
  ])

  onClick("pep", () => {
    if(score >= 20 && over == false){
      play("boostup")
      score -= 20
      pepperBoost *= 2
    }
  })
  

	function jump() {
		if (player.isGrounded() && over == false) {
			player.jump(JUMP_FORCE);
      run = false
      if(angry == true){
        player.play('angry_jump')
      }
      else{
        player.play('jump')
      }
      JUMP_FORCE = 0
		}
	}

  function add_jump(){
    if(JUMP_FORCE < 800){
      JUMP_FORCE += 100
    }
  }

	// jump when user press space
	onKeyDown("space", add_jump);
	//onClick(add_jump);
  onKeyRelease("space", jump)

	function spawnTree() {
    if(over == false){
		// add tree obj
    rh = rand(1,2.5)
		add([
			sprite("taco"),
      scale(1,rh),
      outline(1),
			area(),
			pos(width(), height() - FLOOR_HEIGHT),
			origin("botleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			"tree",
		]);

    add([
      sprite('pepper'),
      area(),
      scale(2,2),
      pos(width() + 10, height() - 74 - (32 * rh)),
      origin("botleft"),
      move(LEFT, SPEED),
      "pepper"
    ]);

		// wait a random amount of time to spawn next tree
		wait(rand(1, 1.3), spawnTree);
    }
	}

	// start spawning trees
  wait(2, spawnTree)
	//spawnTree();
  
	const scoreLabel = add([
		text(score),
    scale(0.5,0.5),
		pos(width() - 64, 16),
	]);

  const hpCounter = add([
    text(hp),
    scale(0.5,0.5),
    pos(40,8)
  ])

  add([
    sprite("hp"),
    pos(8,8)
  ])
	// lose if player collides with any game obj with tag "tree"
	player.onCollide("tree", () => {
		// go to "lose" scene and pass the score
    play("hurt")
		shake();
    if(over == false){
      hp -= 1
    }
    if(hp <= 0){
      over = true
    }
	});

  player.onCollide("pepper", (p) => {
    play("eat")
    destroy(p);
		score += 1 * pepperBoost;
  })

  player.onCollide("gp", (gp) => {
    play("gold")
    destroy(gp);
    wait(3,() => {
        go("win")
      })
  })

	// keep track of score

	// increment score every frame
	onUpdate(() => {
    
    if(SPEED < 500){
      SPEED += 0.02;
    }
    if(angry == true && angryTime > 0){
      angryTime -= 1/60
    }
    else if(angry == true && angryTime <= 0){
      angry = false
      hp = last_hp
      SPEED = last_SPEED
    }
		scoreLabel.text = score;
    hpCounter.text = hp
    if(over == true){
      if(angry == true){
        player.play("angry_over")
      }
      else{
        player.play('over')
      }
      wait(2,() => {
        go("lose", score)
      })
    }
    else if(player.isGrounded() && run == false){
      run = true
      if(angry == true){
        player.play("angry_run")
      }
      else{
        player.play('run')
      }
    }
	});

});

scene("thescore", () => {
  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ])
  over = false;
  pepperBoost = 1
  pepperCount = 0;
  hp = 3
	const player = add([
		sprite("Cookwalkright"),
		pos(width() / 2 - 10, height() / 2 - 40),
		scale(2),
		origin("center"),
	]);
  
  player.play("idle");
  play("angry")
	// display score
	add([
		text(score),
		pos(width() / 2 - 8 , height() / 2 + 30),
		origin("center"),
    scale(0.6,0.6)
	]);

  score = 0;

  add([
    sprite("key"),
    pos(width() / 2 - 30, 180)
  ])

  add([
    text("Press"),
    pos(width() / 2 - 70, 180),
    scale(0.15,0.15)
  ])

  add([
    text("to play"),
    pos(width() / 2 + 20, 180),
    scale(0.15,0.15)
  ])

  add([
    sprite("back"),
    area(),
    pos(width() - 100, 175),
    "b"
  ])

  onClick("b", () => go("menu"))
	// go back to game with space is pressed
	onKeyPress("space", () => go("game"));
	//onClick(() => go("game"));

});

scene("howtoplay", () => {

  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ])
  
  add([
		rect(width(), FLOOR_HEIGHT),
		outline(1),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(24,121,176)
    
	]);
  const hu = add([
    sprite("hu"),
    pos(32, height() - 40)
  ])

  add([
    text("buy powerups to\nboost your gameplay"),
    scale(0.1,0.1),
    pos(hu.pos.x + 35, hu.pos.y + 10)
  ])
  
  add([
    sprite("back"),
    area(),
    pos(width() / 2 - 40, height() - 30),
    "b"
  ]);

  const hcook = add([
    sprite("hcook"),
    pos(80, height() - 48 - 30),
    origin("botleft"),
    scale(2,2)
  ])

  const htaco = add([
    sprite("htaco"),
    pos(360, height() - 112),
    scale(1,2)
  ])

  add([
    sprite("hpepper"),
    pos(htaco.pos.x, htaco.pos.y - 32 * 2),
  ])

  add([
    text("press SPACE to charge jump"),
    pos(hcook.pos.x - 8, hcook.pos.y - 32 * 2.5),
    scale(0.1,0.1)
  ])

  add([
    text("collect those awsome peppers"),
    pos(htaco.pos.x - 48, htaco.pos.y - 32 * 2.8),
    scale(0.1,0.1),
  ])

  add([
    text("don't crash into these\nspicy souce tacos"),
    scale(0.1,0.1),
    pos(htaco.pos.x - 100, htaco.pos.y)
  ])

  add([
    text("Hologram tutorial"),
    scale(0.2,0.2),
    color(24,121,176),
    pos(width() / 3, 5)
  ])
  
  onClick("b", () => go("menu"))
})

scene("lores", () => {
  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ])
  add([
    sprite("back"),
    area(),
    pos(width() / 2 - 40, height() - 30),
    "b"
  ])

  add([
    text("Lore"),
    pos(width() / 2 - 32, 8),
    scale(0.2,0.2),
    color(231,18,18)
  ])

  add([
    text("Once apon time, there was really good cook named Pedro.\nHe was obsessed with the spiciness of his dishes.\nOne day he found a legend about Golden Pepper Fields, \nthat contains the world spicest peppers.\n\nLegend says that by avoiding less spicy food and eating more spicy ones,\nyou'll get worthy and find the golden fields.\nPedro decided to take the challange.\n\nHowever all lines of this legend, \nwhere is stands the name \"Golden Pepper Fields\" \nhas always 253 characters. \nIs this a hint? Does golden peppers want to tell you somethink?"),
    scale(0.1,0.1),
    pos(width() / 4 + 16, height() / 6)
  ])

  add([
    sprite("goldenpepper"),
    pos(32, height() / 3),
    scale(2,2),
    rotate(20)
  ])

  add([
    sprite("253"),
    pos(width() - 32, height() / 2 - 8),
    rotate(45)
  ])
  
  onClick("b", () => go("menu"))
})

scene("intro", () => {
  add([
    rect(width(), height()),
    pos(0,0),
    color(172,146,115)
  ])
  add([
    text("made by RealFiction"),
    scale(0.2,0.2),
    pos(width() / 2 - 90, height() / 2 - 16),
    color(23,158,188)
  ])

  add([
    sprite("key"),
    pos(width() / 2 - 45, height() / 1.5)
  ])

  add([
    text("Press"),
    pos(width() / 2 - 85, height() / 1.5),
    scale(0.15,0.15)
  ])

  add([
    text("to continue"),
    pos(width() / 2 + 5, height()/ 1.5),
    scale(0.15,0.15)
  ])

  onKeyPress("space", () => go("menu"));
  onClick(() => go("menu"));
})

go("intro");