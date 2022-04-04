const Jimp = require("jimp");
const program_mode = true;

// updated with day 2 spec
const palette = [
	0xff4500, 0xffa800, 0xffd635, 0x00a368, 0xbe0039, 0xff3881, 0x6d001a, 0xfff8b8, 0x7eed56, 0x2450a4, 0x3690ea, 0x51e9f4, 0x00756f, 0x009eaa, 0x00ccc0, 0x94b3ff,
	0x711e9f, 0xb44ac0, 0xff99aa, 0x9c6926, 0x493ac1, 0x6a5cff, 0xe4abff, 0xde107f, 0x000000, 0x898d90, 0xd4d7d9, 0xffffff, 0x00cc78, 0x6d482f, 0xffb470, 0x515252
//	0x6d001a, 0xbe003a, 0xf84400, 0xf6a201, 0xf7d032, 0xfff8b8, 0x08a268, 0x09cc78, 0x80ed56, 0x02756f, 0x019eaa, 0x09ccc0, 0x2450a5, 0x3690ea, 0x51e9f4, 0x493ac1,
//	0x6b5cff, 0x95b3ff, 0x821f9f, 0xb44bc0, 0xe5abff, 0xde107f, 0xff3981, 0xff99aa, 0x6f482f, 0x9e6925, 0xffb470, 0x010000, 0x515252, 0x898d90, 0xdcdddf, 0xffffff
].map((c) => c * 256 + 255);

function overlayify(image_path, x, y) {
	return new Promise((resolve, reject) => {
		// create 2000x2000 canvas
		let canvas = new Jimp(2000, 2000, 0x00000000);
		Jimp.read(image_path).then((im) => {
			canvas.composite(im, x, y);
			canvas.resize(6000, 6000, Jimp.RESIZE_NEAREST_NEIGHBOR);
			// for every pixel
			for (let px = 0; px < canvas.bitmap.width; px++) {
				for (let py = 0; py < canvas.bitmap.height; py++) {
					let col = canvas.getPixelColor(px, py);
					if (py % 3 !== 1 || px % 3 !== 1) {
						canvas.setPixelColor(col - (col % 0x100), px, py);
					} else if (col !== 0x00000000) {
						// replace with closest color in the palette
						canvas.setPixelColor(
							palette.sort((a, b) => compare_color(a,col) - compare_color(b, col))[0],
							px,
							py
						);
					}
				}
			}
			resolve(canvas);
		});
	});
}

// l2 norm comparison, not great but it will do
function compare_color(a, b) {

	delta_r = ((a >> 24) & 0xff) - ((b >> 24) & 0xff)
	delta_g = ((a >> 16) & 0xff) - ((b >> 16) & 0xff)
	delta_b = ((a >> 8) & 0xff) - ((b >> 8) & 0xff)
	return delta_r**2 + delta_g**2 + delta_b**2

}

if (program_mode) {
	overlayify(
		process.argv[2],
		parseInt(process.argv[3]),
		parseInt(process.argv[4])
	).then((ov) => ov.write(process.argv[2].replace(/\.png$/, "overlay.png")));
}
