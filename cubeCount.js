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

var cubes = 0;
var plates = 0;
for(i=0; i < save.brick_count; i++) {
	var brick = save.bricks[i];
	if(save.brick_assets[brick.asset_name_index] == "PB_DefaultBrick" && brick.size[0] % 20 == 0 && brick.size[1] % 20 == 0 && brick.size[2] % 20 == 0)
		cubes++;
	if(save.brick_assets[brick.asset_name_index] == "PB_DefaultBrick" && brick.size[0] % 20 == 0 && brick.size[1] % 20 == 0 && brick.size[2] == 2)
		plates++;
}
console.log(`Cube count: ${cubes}\nPlate count: ${plates}\nTotal terrain: ${cubes + plates}`);
