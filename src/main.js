const fs = require('fs');
const { performance } = require('perf_hooks');

function getWordDir() {
	if (process.argv.length !== 3) {
		console.log('[?] Usage: npm run start -- ../polished/work/dir/');
		throw new Error('Invalid amount of arguments passed.');
	}

	let arg = process.argv[2];
	if (arg.length > 1 && arg[arg.length - 1] === '/') {
		arg = arg.slice(0, arg.length - 1);
	}

	return arg;
}

async function getManifest(workDir) {
	const content = await fs.promises.readFile(`${workDir}/manifest.json`);
	return JSON.parse(content);
}

async function main() {
	console.log(`Study [v1.0.0]`);
	console.log('---------------------------------');

	const startTime = performance.now();

	const workDir = getWordDir();
	const manifest = await getManifest(workDir);

	console.log('[@] Studying...');

	const distributions = manifest.metadata.reduce((total, m) => {
		m.attributes.forEach(attr => {
			if (total[attr.trait_type] && total[attr.trait_type][attr.value]) {
				total[attr.trait_type][attr.value] += 1;
			} else {
				total[attr.trait_type] = {
					...total[attr.trait_type],
					[attr.value]: 1,
				};
			}
		})
		return total;
	}, {});

	const endTime = (Math.abs(performance.now() - startTime) / 1000).toFixed(4);

	console.log('---------------------------------');
	console.log(distributions);
	console.log(`Study completed in ${endTime}s`);
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
