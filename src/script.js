
var lastChild = null;
document.onkeydown = function(e) {
	if (document.activeElement.className != "note") {
		if (e.key == "Escape" && lastChild) {
			document.body.appendChild(lastChild);
		}
		document.getElementById("search").focus();
	} else {
		if (e.key == "Escape") {
			lastChild = document.activeElement;
			document.body.removeChild(document.activeElement);
			lmpos = [0,0];
		}
		storeNotes();
	}
}

var lmpos = [0,0];
function storeNotes() {
	notes = document.getElementsByClassName("note");
	savefile = [];
	for (var i = 0; i < notes.length; i++) {
		color = notes[i].style.backgroundColor;
		x = parseInt(notes[i].style.left);
		y = parseInt(notes[i].style.top);
		content = notes[i].value;
		savefile.push([color, x, y, content.split(".").join("&punt:").split(";").join("&punticoma:")].join("."));
	}
	localStorage.setItem("savefile", savefile.join(";"));
}
class note {
	constructor() {
		this.n = document.createElement("textarea");
		this.n.className = "note";
		this.n.spellcheck = false;
		this.n.onmousedown = function(e) {
			this.setAttribute("data-dragging", "ye");
		}
		this.n.onmouseup = this.n.onmouseleave = function(e) {
			this.setAttribute("data-dragging", "na");
			lmpos = [0,0];
			storeNotes();
		}
		this.n.onmousemove = function(e) {
			if (this.getAttribute("data-dragging") == "ye") {
				if (lmpos[0] != 0 && lmpos[1] != 0) {
					this.style.left = parseInt(this.style.left)+e.clientX-lmpos[0]+"px";
					this.style.top = parseInt(this.style.top)+e.clientY-lmpos[1]+"px";
				}
				lmpos = [e.clientX, e.clientY];
			}
		}
	}
	makeup(color, x, y, content = "") {
		this.n.style.backgroundColor = color;
		this.n.style.top = y+"px";
		this.n.style.left = x+"px";
		this.n.value = content;
	}
	stick() {
		document.body.appendChild(this.n);
		storeNotes();
	}
}

try {
	if (localStorage.getItem("savefile")) {
		sn = localStorage.getItem("savefile").split(";");
		for (var i = 0; i < sn.length; i++) {
			saved = sn[i].split(".");
			n = new note();
			n.makeup(saved[0], saved[1], saved[2], saved[3].split("&punt:").join(".").split("&punticoma:").join(";"));
			n.stick();
		}
	}
} catch(e) {
	console.log("You are unironically a stupid loser.");
}

var colors = ["#341A32", "#341A1E", "#342C1A", "#1A341A", "#1A3433", "#1A1F34"];
function createNote(x, y) {
	n = new note();
	color = colors[parseInt(Math.random()*colors.length)];
	n.makeup(color, x, y);
	n.stick();
}

// CARDS
//var vignette = document.getElementById("vignette");
var base_style = document.getElementsByClassName("card")[0].style;
function perspective(card, e) {
	// Get card coordinates, alternative is layerX/Y but will conflict with links.
	clx = e.clientX-card.getBoundingClientRect().left;
	cly = e.clientY-card.getBoundingClientRect().top;
	// From relative mouse position to range from -25 to 25, to use in rotate degrees.
	xp = parseInt((cly/card.offsetHeight*50-25)*-1);
	yp = parseInt(clx/card.offsetWidth*50-25);
	// Change rotation and styles.
	card.style.transform = "perspective(15cm) rotateX("+xp+"deg) rotateY("+yp+"deg) scale(1.2)";
	card.style.zIndex = "100";
	card.style.boxShadow = "none";
	//vignette.style.opacity = 1;
}
function reset(card) {
	//vignette.style.opacity = 0;
	card.style = base_style
}

// get the correct date oriental
const nth = function(d) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

// BIG BLACK CLOCK
// There is nothing wrong with me there is everything wrong with the world shut up
h = document.getElementById("hour");
m = document.getElementById("minute");
s = document.getElementById("second");
ts = document.getElementById("timestamp");
ds = document.getElementById("datestamp");
function calibrate() {
	d = new Date();
	hp = d.getHours();
	mp = d.getMinutes();
	sp = d.getSeconds();
	h.style.transform = "translateX(-50%) rotate("+(((hp+mp/60)/24)*720)+"deg)";
	m.style.transform = "translateX(-50%) rotate("+(mp/60*360)+"deg)";
	s.style.transform = "translateX(-50%) rotate("+(sp/60*360)+"deg)";
	ts.innerText = ("0"+hp).substr(-2,2)+":"+("0"+mp).substr(-2,2)+":"+("0"+sp).substr(-2,2);
	ds.innerText = "Today is " + d.toLocaleString('default', {weekday: 'long'}) + ", the " + d.getDate() + nth(d.getDate()) + " of " + d.toLocaleString('default', {month: 'long'});
	//d.toLocaleString('default', {month: 'long'});
}
calibrate();
setInterval(calibrate, 1000);
