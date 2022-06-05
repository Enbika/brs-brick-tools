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
	
	fs.writeFileSync(`bricks_${save.brick_owners[owner_index].id}.txt`,""); // blank out file
	for(i=0; i < save.brick_owners[owner_index].bricks; i++) {
		fs.appendFileSync(`bricks_${save.brick_owners[owner_index].id}.txt`,`${owned_bricks[i].position[0]} ${owned_bricks[i].position[1]} ${owned_bricks[i].position[2]}\n`);
	}
	console.log(`Wrote ${save.brick_owners[owner_index].bricks} bricks to bricks_${save.brick_owners[owner_index].id}.txt`);
}
