const canvas = document.querySelector("canvas");
canvas.setAttribute("width",window.innerWidth + "px");
canvas.setAttribute("height",window.innerHeight + "px");
const ctx = canvas.getContext("2d");

function collatz(x,arr=[]){
	arr.push(x);
	if(x <= 1) {
		return arr;
	}
	let n;
	if(x % 2 == 0){
		n = x / 2;
	} else {
		n = 3 * x + 1;
	}
	return collatz(n,arr);
}

function decollatz(x,arr=[]){
	if(x > 100) return arr;

	let even = [];
	let odd = [];

	even.push(x * 2);
	if((x - 1) % 3 == 0){
		odd.push((x - 1) / 3)
	}

	arr.push({x,even,odd});

	return decollatz(x + 1,arr);
}

function collatzTo(end=100,shoots=[]){
	let count = [];
	for(let i=1;i<=end;i++){
		let c = collatz(i);
		if(!shoots.includes(c[0])){
			let biggest = -Infinity;
			for(let i=0;i<shoots.length;i++){
				if(shoots[i] > biggest){
					biggest = shoots[i];
					break;
				}
			}
			if(c.includes(biggest)){
				shoots.push(c[0]);
			}
		}
		count.push({i,c});
	}
	return {count,shoots};
}

function highestCollatz(end,from=1){
	let highest = {of:null,length:-Infinity};
	for(let i=from;i<=end;i++){
		let c = collatz(i);
		if(c.length > highest.length){
			highest.length = c.length;
			highest.of = i;
			console.log("Current highest ",highest);
		}
	}
	return highest;
}

//ctx.scale(3,3);

let TOP_SCREEN = -Infinity;
let DOWN_SCREEN = Infinity;

function drawCollatz(mouse){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "red";
	ctx.save();
	ctx.translate(mouse.clientX,mouse.clientY);
	let trash = [];
	for(let row=0;row<=10;row++){
		for(let col=1;col<=10;col++){
			let i = row * 10 + col;
			let c = collatz(i);
			c.forEach((num,j) => {
				// if(trash.includes(num)) return;
				let angle = j * Math.PI / c.length - Math.PI;
				let radius = 10 * Math.sin(i);
				// ctx.save();
				ctx.beginPath();
				ctx.moveTo(col * canvas.width / 10 - 100,row * canvas.height / 10 - 100);
				ctx.lineTo((radius - 10) * Math.cos(angle),(radius - 10) * Math.sin(angle));
				ctx.stroke();
				// ctx.restore();
				ctx.translate(radius * Math.cos(angle),radius * Math.sin(angle));
				ctx.fillText(num,0,0);
				trash.push(num);
			});
		}
	}
	ctx.restore();
}

window.onmousemove = drawCollatz;