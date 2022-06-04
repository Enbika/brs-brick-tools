#!/usr/bin/env node

const fs = require ('fs');
const path = require('path');
const brs = require('brs-js');

var myArgs = process.argv.slice(2);
if(myArgs[0] == undefined) {
	console.error("Error: BRS file not specified.");
	return;
}

var distance = 10000; // default to 10k units (or 1k studs)
if(myArgs[1] !== undefined)
	distance = Math.abs(Number(myArgs[1]));

const file = path.resolve(myArgs[0]);
const buffer = fs.readFileSync(file);
const save = brs.read(buffer);

fs.writeFileSync("bricks.txt",""); // blank out file
for(i=0; i < save.brick_count; i++) {
	var brick = save.bricks[i];
	if(Object.keys(brick.components).length > 0) 
		fs.appendFileSync("bricks.txt",`${brick.position[0]} ${brick.position[1]} ${brick.position[2]}, owned by ${save.brick_owners[brick.owner_index-1].name}` +
		(brick.components.BCD_SpotLight ? `, ${brick.components.BCD_SpotLight.bCastShadows ? "SHADOW " : ""}spot light` : "") + 
		(brick.components.BCD_PointLight ? `, ${brick.components.BCD_PointLight.bCastShadows ? "SHADOW " : ""}point light` : "") + 
		(brick.components.BCD_ItemSpawn ? ", item spawn" : "") + 
		(brick.components.BCD_Interact ? ", interact" : "") + 
		(brick.components.BCD_AudioEmitter ? ", audio" : "") + 
		'\n');
		if(brick.components.BCD_Interact)
			fs.appendFileSync("bricks.txt",`${brick.components.BCD_Interact.Message ? `Message: ${brick.components.BCD_Interact.Message}\n` : ""}${brick.components.BCD_Interact.ConsoleTag ? `Tag: ${brick.components.BCD_Interact.ConsoleTag}\n` : ""}\n`);
}
