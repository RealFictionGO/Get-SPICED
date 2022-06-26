import kaboom from "kaboom"

// initialize context
kaboom()

// load assets
loadSprite("Cookdown1", "sprites/player/Cookdown1.png")

// add a character to screen
const player = add([
	// list of components
	sprite("Cookdown1"),
	pos(80, 40),
	area(),
])

// add a kaboom on mouse click
onClick(() => {
	
})

// burp on "b"
onKeyPress("b", burp)