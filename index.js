const Jimp = require("jimp");
const program_mode = true;

function overlayify(image_path, x, y) {
	return new Promise((resolve, reject) => {
		// create 2000x1000 canvas
		let canvas = new Jimp(2000, 1000, 0x00000000);
		Jimp.read(image_path).then((im) => {
			canvas.composite(im, x, y);
			canvas.resize(6000, 3000, Jimp.RESIZE_NEAREST_NEIGHBOR);
			// for every pixel
			for (let px = 0; px < canvas.bitmap.width; px++) {
				for (let py = 0; py < canvas.bitmap.height; py++) {
					let col = canvas.getPixelColor(px, py);
					col = col - (col % 0x100);
					if (py % 3 !== 1 || px % 3 !== 1) {
						canvas.setPixelColor(col, px, py);
					}
				}
			}
			process.stdout.write("\n");
			resolve(canvas);
		});
	});
}

if (program_mode) {
	overlayify(
		process.argv[2],
		parseInt(process.argv[3]),
		parseInt(process.argv[4])
	).then((ov) => ov.write(process.argv[2].replace(/\.png$/, "overlay.png")));
}
