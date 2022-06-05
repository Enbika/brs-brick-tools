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
process.stdout.write("Loading save, please wait... ");
const save = brs.read(buffer);
console.log(`${save.brick_count} bricks loaded.`);

var farBricks = 0;
save.bricks.forEach((brick) => {
	if(Math.abs(brick.position[0]) > distance || Math.abs(brick.position[1]) > distance || Math.abs(brick.position[2]) > distance) {
		if(farBricks == 0) fs.writeFileSync("farbricks.txt","");
		fs.appendFileSync("farbricks.txt",`${brick.position[0]} ${brick.position[1]} ${brick.position[2]}, owned by ${save.brick_owners[brick.owner_index-1].name}\n`);
		farBricks++;
	}
});

if(farBricks > 0) 
	console.log(`Wrote ${farBricks} bricks to farbricks.txt.`);
else
	console.log(`No bricks beyond ${distance} units were found.`);
