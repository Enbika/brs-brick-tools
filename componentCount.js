#!/usr/bin/env node

const fs = require ('fs');
const path = require('path');
const brs = require('brs-js');

var myArgs = process.argv.slice(2);
if(myArgs[0] == undefined) {
	console.error("Error: BRS file not specified.");
	return;
}

const file = path.resolve(myArgs[0]);
const buffer = fs.readFileSync(file);
process.stdout.write("Loading save, please wait... ");
const save = brs.read(buffer);
console.log(`${save.brick_count} bricks loaded.`);

fs.writeFileSync("components.csv","Name,Total Components,Spot Lights,Point Lights,Item Spawns,Interacts,Audio Emitters\n"); // blank out file
for(i=0; i < save.brick_count; i++) {
	var brick = save.bricks[i];
	if(save.brick_owners[brick.owner_index-1].components == null)
		save.brick_owners[brick.owner_index-1].components = 0;
	
	if(save.brick_owners[brick.owner_index-1].spotlights == null)
		save.brick_owners[brick.owner_index-1].spotlights = 0;
	if(save.brick_owners[brick.owner_index-1].pointlights == null)
		save.brick_owners[brick.owner_index-1].pointlights = 0;
	if(save.brick_owners[brick.owner_index-1].items == null)
		save.brick_owners[brick.owner_index-1].items = 0;
	if(save.brick_owners[brick.owner_index-1].interacts == null)
		save.brick_owners[brick.owner_index-1].interacts = 0;
	if(save.brick_owners[brick.owner_index-1].audio == null)
		save.brick_owners[brick.owner_index-1].audio = 0;

	save.brick_owners[brick.owner_index-1].components += Object.keys(brick.components).length;
	
	if(brick.components.BCD_SpotLight)
		save.brick_owners[brick.owner_index-1].spotlights++;
	if(brick.components.BCD_PointLight)
		save.brick_owners[brick.owner_index-1].pointlights++;
	if(brick.components.BCD_ItemSpawn)
		save.brick_owners[brick.owner_index-1].items++;
	if(brick.components.BCD_Interact)
		save.brick_owners[brick.owner_index-1].interacts++;
	if(brick.components.BCD_AudioEmitter)
		save.brick_owners[brick.owner_index-1].audio++;
}

var sorted_owners = save.brick_owners.sort((a,b) => { return b.components - a.components });

for(i=0; i < sorted_owners.length; i++) {
	var owner = sorted_owners[i];
	if(owner.components > 0) {
		fs.appendFileSync("components.csv",`${owner.name},${owner.components}` +
			 "," + (owner.spotlights > 0 ? owner.spotlights : "") +
			 "," + (owner.pointlights > 0 ? owner.pointlights : "") +
			 "," + (owner.items > 0 ? owner.items : "") +
			 "," + (owner.interacts > 0 ? owner.interacts : "") +
			 "," + (owner.audio > 0 ? owner.audio : "") +
		"\n");
	}
}
