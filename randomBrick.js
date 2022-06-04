#!/usr/bin/env node

const fs = require ('fs');
const path = require('path');
const brs = require('brs-js');

var myArgs = process.argv.slice(2);
if(myArgs[0] == undefined) {
	console.error("Error: BRS file not specified.");
	return;
}
if(myArgs[1] == undefined) {
	console.error("Error: Name not specified.");
	return;
}

const file = path.resolve(myArgs[0]);
const buffer = fs.readFileSync(file);
process.stdout.write("Loading save, please wait... ");
const save = brs.read(buffer);
console.log(`${save.brick_count} bricks loaded.`);

var owner_index = -1;
if(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i.test(myArgs[1]))
    owner_index = save.brick_owners.findIndex(obj => obj.id == myArgs[1].toLowerCase());
else
    owner_index = save.brick_owners.findIndex(obj => obj.name == myArgs[1]);

if(owner_index == -1)
    console.error("Error: Brick owner not found.");
else {
    const owned_bricks = save.bricks.filter(obj => { return obj.owner_index == owner_index + 1});
    const random_brick_id = Math.floor(Math.random() * save.brick_owners[owner_index].bricks)
    const random_brick = owned_bricks[random_brick_id];
    
    console.log(`Brick ${random_brick_id + 1} of ${save.brick_owners[owner_index].bricks}\n${random_brick.position[0]} ${random_brick.position[1]} ${random_brick.position[2]}`);
}
