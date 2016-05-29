/*  Cool Javascript Slideshow
	Version: 1.3c
	Written By: Jeff Baker	Copyright April 13, 2009
	Website: www.seabreezecomputers.com/slideshow
		
	Description: This Javascript will display a slideshow with
	crossfade transitions and more, including photo effects.
	It grabs the photos from an invisible textarea in your HTML document.
	
	Copy and paste the following in your HTML document where you 
	want the slideshow to appear:
	<SCRIPT TYPE="text/javascript" LANGUAGE="JavaScript" SRC="coolslide.js"></SCRIPT>
*/

// You may edit the variables below:
var folder = './images/'; // if your photos are in a different folder specify it here
// example: var folder = 'images/'; 
// or same folder as js file then: var folder = '';
var phwidth = 580; // pictureholder width
var phheight = 390; // pictureholder height
// pictureholder DIV also has the class 'pictureholder' so you can add CSS border etc.
var photosize = 800; // width to show photos at
// Valid sizes are: 32, 48, 64, 72, 144, 160, 200, 288, 320, 400, 512, 576, 640, 720, 800
var seconds = 5; // switch photos n seconds
var randomize_photos = 0; // 0 = Do not randomize photos; 1 = Randomize photos
var display_caption = 0; // 0 = No caption; 1 = Display Description below photo
var caption_height = 50; // How many pixels high for caption box if on
var caption_border = 1; // Caption border pixels
// captionholder DIV has the class 'captionholder' so you can add CSS
var pan_zoom = 1.3;  // how many times to zoom before panning
var trans = "random"; // default transition between photos
var effect = "random"; // default effect on photos
/* 	The trans variable stands for transitions.  The following trans are possible:
	none, random, crossfade, zoom(from), wipe(from), slide(from)
	from = upperleft, top, upperright, left, center, right, lowerleft, bottom, lowerright
	(*slide does not support center)
	(**wipe supports left, right, center, top and bottom)
*/
/*	The effect variable is for photo effects.  Possible options are:
	none, random, zoomin(to), zoomout(to), pan(to)
	to = upperleft, top, upperright, left, center, right, lowerleft, bottom, lowerright
	(*pan does not support center)
*/
var cur_pic = 0; // which photo to start with. 0 is first photo in album.
var trans_amount = 20; // amount of steps for transitions
var effect_amount = 100; // amount of steps for effects
var testing_mode = 0; // 0 = off; 1 = on; testing mode creates a DIV with ID testing to display testing info
/* 	The following time variables are in milliseconds.
	If you see a flicker of a background photo after
	a transition then you may want to increase the
	flicker time.  You can also play with the other
	time variables if animation is not smooth. */
var flicker_time = 300; // ms between photo operations
var opacity_time = 50; // ms between opacity
var trans_time = 32; // ms between transition steps
var effect_time = 45; // ms between effect steps


/* Create an invisible textarea in your HTML document
like the one below with
the filename of each picture on a separate line:

<textarea id="piclist" style="display:none;"> 
image1.jpg
image2.jpg
image3.gif
image4.png
</textarea>

*/

/*	You may also specify transitions, effects, and time in the TEXTAREA.
 	If you specify these then they override the default settings
	above.  The format is similar to a combination of HTML and Javascript.
	Just add the code after each image filename and that photo will
	be effected by the code. Separate the filename and the code with ##
	Examples:
<textarea id="piclist" style="visibility:hidden"> 
image1.jpg##<time=5> <trans=slide(right)> <effect=zoomin(center)> This is a caption.
image2.jpg##This is a photo of the <b>beach</b> nearby
image3.gif##Beautiful Sunset <time=6> <trans=crossfade> <effect=zoomout(upperleft)>
image4.png
</textarea>
	
	time is the amount of seconds to display a photo.  Anything else you
	have in the description including HTML markups will display in the
	caption box if you have captions turned on above.
*/

/* DO NOT CHANGE ANY VARIABLES BELOW */
var pictures = new Array(); // will hold an array of all the pics
var ie = (document.all) // ie 5 or higher
var picture = "picture";
var picture2 = "picture2";  // Needed so Firefox and Netscape don't have javascript console errors
var pwidth;
var pheight;
var zwidth;
var zheight;
var ztimer; // timer for zoom effect
var zxstep; // zoom effect xstep
var zystep; // zoom effect ystep
var zleft = 0;
var ztop = 0;
var cleft = 0;  // to center photo
var ctop = 0; // to center photo

//testingbox = document.getElementById('testing');


function none(amount, none)
{
	// just a silly function to prevent an error for having effect none
	if (none == '1') // Means no transition
		setTimeout('changepic();', pictures[cur_pic].time);
} // end function none(amount)



function toHTML (myString)
{
    htmlString = myString.split("&lt;").join("<");
    htmlString = htmlString.split("&gt;").join(">");
    htmlString = htmlString.split("&quot;").join("\"");
    htmlString = htmlString.split("&apos;").join("\'");
    return htmlString;
} // end function toHTML(myString)


function loadpics()
{
	
	var pic_array = new Array();
	var pic_list = document.getElementById('piclist').innerHTML;
	pic_list = pic_list.replace(/\t/gi, ""); 	// Remove all tabs - 12/17/10 ver 1.3b
	var pic_list_length = pic_list.length;
	var temp = new Array();
	var temp2 = 'hi';
	var file; 
	
	// Remove all CRs (13) from IE's textarea
	pic_list = pic_list.replace(/\r/gi, "");
	// first remove first carriage return if there is one
	// IE = CRLF (1310)
	// Firefox + Netscape = LF (10)
	// Safari = LFLF (1010)
	// So the first if statement is for IE and Safari
	// to check for LF on the second character
	if (pic_list.charAt(1) == '\n')
		pic_list = pic_list.substr(1);
	if (pic_list.charAt(0) == '\n')
		pic_list = pic_list.substr(1);
	// now remove carriage return from the end of string if there is one
	// first if needed for Safari
	// second if needed for netscape and firefox
	if (pic_list.charAt(pic_list_length-3) == '\n')
		pic_list = pic_list.substr(0, pic_list_length-3);
	if (pic_list.charAt(pic_list_length-2) == '\n')
		pic_list = pic_list.substr(0, pic_list_length-2);
	if (pic_list.charAt(pic_list_length-1) == '\n')
		pic_list = pic_list.substr(0, pic_list_length-1);
	
	// Note: IE will only split a TEXTAREA by \n. It will not
	// work with a DIV
	pic_array = pic_list.split('\n');
	
	for (i = 0; i < pic_array.length; i++)
	{
		temp = pic_array[i].split('##');
		file = folder+temp[0]; // folder and filename of photo
		if (typeof(temp[1]) != 'string') // sometimes there is no description
			temp[1] = '';

		temp[1] = toHTML(temp[1]); // convert textarea info to HTML
		temp2 = temp[1];  // temp2 = description after ##
		
		//temp2 = temp2.replace(/&lt;/
		//temp2 = temp2.replace(/effect/gi, "");
		temp2 = temp2.replace(/<trans[^>]*>/gi, "");
		temp2 = temp2.replace(/<effect[^>]*>/gi, "");
		temp2 = temp2.replace(/<title[^>]*>/gi, "");
		temp2 = temp2.replace(/<time[^>]*>/gi, "");
  		
		pictures[i] = {	photo: new Image,
		  				description: temp[1],
						caption: temp2,
						trans: '',
						effect: '',
						time: '',
						title: '',
						url: ''}; // 7/26/10
						
  	 	pictures[i].photo.src = file;

		//document.write(temp2);
		//document.getElementById('testing').innerHTML = i+". "+pictures[i].photo.width+", "+pictures[i].photo.height+"<BR>";
		//document.write(pictures[i].width+", "+pictures[i].height+"<BR>");
		//document.write("<IMG SRC='"+pictures[i].photosrc+"'>;");
	}
	if (randomize_photos == 1)
		shuffle_photos(); // shuffle or randomize photos
	
	setup_functions();
		
	init_show();

}  // function loadpics()


function init_show()
{
	// Create a loading progress bar in pictureholder
	document.getElementById('pictureholder').innerHTML = '<div style="text-align: center;'+
		'position: absolute; vertical-align: middle; font-size: 1.5em; width: 100%;">' +
		'LOADING'+
		'<span id="bar"></span></div>';
	// load 5 photos complete or pictures.length complete,  whichever is smaller
	for (i = 0; i < pictures.length && i < 5; i++)
	{	
		pcomplete = pictures[i].photo.complete;
		if (pcomplete)
		document.getElementById('bar').innerHTML = '<hr width="'
			+((phwidth/5)*i)+'" size="12" noshade="noshade" />'; 
	}

	if (!pcomplete)
	{
		setTimeout("init_show()", 10);
		return;
	}
	
	// Now create the IMG picture and picture2 inside the pictureholder DIV
	document.getElementById('pictureholder').innerHTML='<img id="picture" class="picture"'+
		' style="top: 0px; left: 0px; overflow:hidden; position:absolute;">'+
		'<img id="picture2" class="picture"'+
		' style="top: 0px; left: 0px; overflow:hidden; position:absolute;">';
		
	// make sure picture is 100% opaque
	set_opacity('picture', 0);

	// set opacity of picture2 to invisible
	set_opacity('picture2',0);
	
	document.getElementById('picture2').src = pictures[cur_pic].photo.src;
		document.getElementById('picture2').width = pictures[cur_pic].photo.width;
			document.getElementById('picture2').height = pictures[cur_pic].photo.height;
				document.getElementById('picture2').style.left = 0 + 'px';
					document.getElementById('picture2').style.top = 0 + 'px';
	center_image('picture2');
	
	// Call effectsetup for first photo
	effectsetup();
	
	if (testing_mode == 1) // 7/26/10
		testingbox.innerHTML += ". trans="+pictures[cur_pic].trans;
	
	// call function transition in duration 'seconds'
	if (pictures[cur_pic].trans == "none(0, '1');") // If transition is 'none'
		changepic(); // Bug fix 12/28/10
	else
		setTimeout(pictures[cur_pic].trans, 0);
	
	//changepic();
		
} // end function init_show()

function center_image(obj)
{	
	// since we have to make absolute positioned images
	// in order to display images on top of each other
	// for transition effects, we need to find a way
	// to place the next image on the center of
	// pictureholder
	cwidth = parseFloat(pictures[cur_pic].photo.width);
	cheight = parseFloat(pictures[cur_pic].photo.height);
	// first we need to shrink the width of the photo
	// if it is bigger than photosize
	if (cwidth > photosize)
	{
		//alert(cwidth+", "+cheight);
		perc = cwidth / photosize; // this preserves aspect ratio
		cwidth = Math.floor(cwidth / perc);
		cheight = Math.floor(cheight / perc);
	}
	// Now center photo
	cleft = (phwidth - cwidth) / 2;
	ctop = (phheight - cheight) / 2;

	document.getElementById(obj).style.left = cleft + 'px';

	document.getElementById(obj).style.top = ctop + 'px';	
	
	document.getElementById(obj).width = cwidth;
	
	document.getElementById(obj).height = cheight;
	
	//testingbox.innerHTML = cwidth+", "+cheight;

} // end function center_image()


function shuffle_photos()
{
	pictures.sort(function() 
	{
	return 0.5 - Math.random()
	}) //Array elements now scrambled
	
}  // end function shuffle()


function randomize_trans(i)
{
	rand = Math.floor(Math.random()*4) // 0 to 3
	
	if (rand == 0)
		ftype = "crossfade";
	if (rand == 1)
		ftype = "wipe";
	if (rand == 2)
		ftype = "slide";
	if (rand == 3)
		ftype = "zoom";	
		
	if (ftype == "wipe")
	 	rand = Math.floor(Math.random()*5) // 0 to 4
	else
		rand = Math.floor(Math.random()*9) // 0 to 8
	
	if (rand == 0)
		foption = "left";
	if (rand == 1)
		foption = "right";		
	if (rand == 2)
		foption = "top";
	if (rand == 3)
		foption = "bottom";
	if (rand == 4)
		foption = "center";
	if (rand == 5)
		foption = "upperright";
	if (rand == 6)
		foption = "lowerleft";
	if (rand == 7)
		foption = "lowerright";
	if (rand == 8)
		foption = "upperleft";	
		
	if (ftype == "slide" && rand == 4) // can't slide from the center
		foption = "left";

	if (ftype == "crossfade")
		pictures[i].trans = "crossfade(0);";
	else	
		pictures[i].trans = ftype+"(0, '"+foption+"')"; // slide(0, 'left');	
	
				
} // end function randomize_trans(i)



function randomize_effect(i)
{
	rand = Math.floor(Math.random()*4) // 0 to 3
	
	if (rand == 0)
		ftype = "none";
	if (rand == 1)
		ftype = "zoomin";
	if (rand == 2)
		ftype = "zoomout";
	if (rand == 3)
		ftype = "pan";	
		
	//ftype = "pan";
	
	if (ftype == "pan")
	 	rand = Math.floor(Math.random()*8) // 0 to 7 (no center for pan)
	else
		rand = Math.floor(Math.random()*9) // 0 to 8
	
	if (rand == 0)
		foption = "left";
	if (rand == 1)
		foption = "right";		
	if (rand == 2)
		foption = "top";
	if (rand == 3)
		foption = "bottom";
	if (rand == 4)
		foption = "upperleft";
	if (rand == 5)
		foption = "upperright";
	if (rand == 6)
		foption = "lowerleft";
	if (rand == 7)
		foption = "lowerright";
	if (rand == 8)
		foption = "center";	
		

	if (ftype == "none")
		pictures[i].effect = ftype;
	else	
		pictures[i].effect = ftype+"(0, '"+foption+"')"; // zoomin(0, 'left');		
				
} // end function randomize_effect(i)



function setup_functions()
{
	
	if (trans == "none")
		trans = "none(1)";
	
	// first go through and fill effects and transitions with default
	for (i = 0; i < pictures.length; i++)
	{
		// TRANSITIONS
		if (trans == "random")
			randomize_trans(i);
		else	
		{
		ftype = trans.replace(/['">)']/gi, ""); // ex: slide(left
		foption = ftype.split('('); // ex: slide     /    left
		// Check to see if the user put a real function in trans
		if (eval('typeof('+foption[0]+')') == 'function')
			pictures[i].trans = foption[0]+"(0, '"+foption[1]+"');"; // slide(0, 'left');
		else 
			pictures[i].trans = 'crossfade(0)';  // else just put crossfade for trans
		}
		// EFFECTS
		if (effect == "random")
			randomize_effect(i);
		else
		{
		ftype = effect.replace(/['">)']/gi, ""); // ex: slide(left
		foption = ftype.split('('); // ex: slide     /    left
		// Check to see if the user put a real function in effect
		if (eval('typeof('+foption[0]+')') == 'function')
			pictures[i].effect = foption[0]+"(0, '"+foption[1]+"');";
		else 
			pictures[i].effect = 'none(0)';  // else just put none effect
		}
		pictures[i].time = seconds*1000; // convert seconds into milliseconds
		pictures[i].title = ''; // Blank the title
		pictures[i].url = ''; // blank the onclick 7/26/10
	}
	
	// Now fill in effects and transitions from descriptions
	for (i = 0; i < pictures.length; i++) 
	{
		if (pictures[i].description)
		{
		functions = pictures[i].description.split('<'); // ex: <trans="slide('left')>
		for (f = 0; f < functions.length; f++)
		{
			functions[f] = functions[f].replace(/ = /gi, "="); // v. 1.1 4/12/09 Bug in my code
			//functions[f] = functions[f].toLowerCase(); // v. 1.3c Bug 8/23/11 - was lowering case on urls
			ftype = functions[f].split('='); // ex: trans    /   "slide('left')>
			ftype[0] = ftype[0].toLowerCase(); // v. 1.3c 8/23/11
			if (ftype[1])
			{
			ftype[1] = ftype[1].replace(/['")']/gi, ""); // ex: slide(left>
			ftype[1] = ftype[1].replace(/>[\s\S]*/gi, "");
			//ftype[1] = ftype[1].replace(/>/gi, "");
			foption = ftype[1].split('('); // ex: slide     /    left
			if (ftype[0] == "trans")
			{
			foption[0] == foption[0].toLowerCase(); // v. 1.3c 8/23/11
			// v. 1.12 4/13/09 added random to trans
			if (foption[0] == 'random') 
				randomize_trans(i);
			// Check to see if the user put a real function in trans
			// v. 1.11 4/13/09 switch from if (eval('typeof('+foption[0]+')') == 'function')
			if ((foption[0] == 'none' || foption[0] == 'crossfade' 
					|| foption[0] == 'zoom' || foption[0] == 'wipe' || foption[0] == 'slide')
					&& (foption[1] == 'upperleft' || foption[1] == 'top' || foption[1] == 'upperright'
					|| foption[1] == 'left' || foption[1] == 'center' || foption[1] == 'right'
					|| foption[1] == 'lowerleft' || foption[1] == 'bottom' || foption[1] == 'lowerright'))
				pictures[i].trans = foption[0]+"(0, '"+foption[1]+"')"; // slide(0, 'left');
			}	
			else if (ftype[0] == "effect")
			{	
			foption[0] == foption[0].toLowerCase(); // v. 1.3c 8/23/11
			// v. 1.12 4/13/09 added random to effect
			if (foption[0] == 'random') 
				randomize_effect(i);
			// Check to see if the user put a real function in trans
			// v. 1.11 4/13/09 switch from if (eval('typeof('+foption[0]+')') == 'function'
			if ((foption[0] == 'none' || foption[0] == 'zoomin' 
					|| foption[0] == 'zoomout' || foption[0] == 'pan')
					&& (foption[1] == 'upperleft' || foption[1] == 'top' || foption[1] == 'upperright'
					|| foption[1] == 'left' || foption[1] == 'center' || foption[1] == 'right'
					|| foption[1] == 'lowerleft' || foption[1] == 'bottom' || foption[1] == 'lowerright'))
				pictures[i].effect = foption[0]+"(0, '"+foption[1]+"')";
			}
			else if (ftype[0] == "time")
			{	
				// convert seconds into milliseconds
				pictures[i].time = parseFloat(foption[0])*1000;
			}
			else if (ftype[0] == "title")
			{	
				pictures[i].title = ftype[0];
			}
			else if (ftype[0] == "url") // 7/26/10
			{	
				pictures[i].url = foption[0];
				// v. 1.3c - Added for loop on 8/23/11 in case of = in url
				for (ii=2; ii < ftype.length; ii++)
				{
					ftype[ii] = ftype[ii].replace(/>[\s\S]*/gi, "");
					pictures[i].url += "="+ftype[ii];
				}
			}
			} // end if (ftype[1])
		} // end for
		} // end if pictures[i].description

	}	
	
	// Print to screen
	//for (i = 0; i < pictures.length; i++) 
		//document.write(i+". Transition: "+pictures[i].trans+". Effect: "+pictures[i].effect+"<BR>");
				

} // end function setup_functions()



function set_opacity(object, level)
{
	// The "object" is usally picture, picture2
	// or photo or photo2
	// the level is 0 (transparent) to 100 (opaque)
	if(ie)
	{
        // first create a filter
		document.getElementById(object).style.filter="alpha(opacity="+level+")";
		// then set the opacity
		//document.getElementById(object).filters.alpha.opacity = level;
    }
    else  // mozilla or netscape
	{
		// Netscape has a bug where it flickers at 100% opacity
		// so we will change 100 to 99.999%
		if (level == 100)
			level = 99.999;
		// set the opacity for firefox and netscape
		document.getElementById(object).style.MozOpacity = level/100;
    	// set the opacity for safari prior to 1.2
    	document.getElementById(object).style.KHTMLOpacity = level/100;
		// set the opacity for safari 1.2 and higher and newer firefox
		document.getElementById(object).style.opacity = level/100;
	}

} // end function set_opacity


function crossfade(opacity) 
{

  	
  if (document.getElementById) 
  {

	if (opacity <= 100) 
	{
      set_opacity('picture2', opacity);
      set_opacity('picture', 100 - opacity);
      opacity += 10;
      window.setTimeout("crossfade("+opacity+")", trans_time);
    
	}
    else
    {
    	// I had to put half the seconds here and load the image
    	// early in order to prevent a flicker in IE when
    	// on a web server
		//center_image('picture2');
		//document.getElementById('picture').src = pictures[cur_pic].photo.src;
		setTimeout('changepic();', trans_time);

    }
  }
} // end function crossfade(objID, opacity)


function wipe(amount, from)
{
	pwidth = document.getElementById('picture2').width;
	pheight = document.getElementById('picture2').height;
	xstep = pwidth / trans_amount * amount;
	ystep = pheight / trans_amount * amount;
	 
	
	if (from == "left")
	{
		// clip by rect(top, right, bottom, left)
		document.getElementById('picture2').style.clip = 'rect(' +
		'0px, ' + 
		Math.round(0+xstep) + 'px, ' +
		pheight + 'px, ' + 
		'0px)';
	}
	else if (from == "right")
	{
		// clip by rect(top, right, bottom, left)
		document.getElementById('picture2').style.clip = 'rect(' +
		'0px, ' + 
		pwidth + 'px, ' +
		pheight + 'px, ' + 
		Math.round(pwidth-xstep) + 'px)';
	}
	else if (from == "top")
	{
		// clip by rect(top, right, bottom, left)
		document.getElementById('picture2').style.clip = 'rect(' +
		'0px, ' + 
		pwidth + 'px, ' +
		Math.round(ystep) + 'px, ' + 
		'0px)';
	}
	else if (from == "bottom")
	{
		// clip by rect(top, right, bottom, left)
		document.getElementById('picture2').style.clip = 'rect(' +
		Math.round(pheight-ystep) + 'px, ' + 
		pwidth + 'px, ' +
		pheight + 'px, ' + 
		'0px)';
	}
	else  // if center or none specified
	{
		xcenter = pwidth / 2; // so 640 / 2 = 320
		ycenter = pheight / 2; // so 480 / 2 = 240
		xstep = xcenter / trans_amount * amount;
		ystep = ycenter / trans_amount * amount;
		
		// clip by rect(top, right, bottom, left)
		document.getElementById('picture2').style.clip = 'rect(' +
		Math.round(ycenter-ystep) + 'px, ' + 
		Math.round(xcenter+xstep) + 'px, ' +
		Math.round(ycenter+ystep) + 'px, ' + 
		Math.round(xcenter-xstep) + 'px)';
	}
	
	if (amount == 1)
		set_opacity('picture2', 100);
	
	amount++;
	
	if (amount < trans_amount)
		window.setTimeout("wipe("+amount+", '"+from+"');", trans_time);
	else
    {
    	// reset clip
    	document.getElementById('picture2').style.clip = 'rect(auto, auto, auto, auto)';
		// I had to put half the seconds here and load the image
    	// early in order to prevent a flicker in IE when
    	// on a web server
		//document.getElementById('picture').src = pictures[cur_pic].photo.src;
    	setTimeout('changepic();', trans_time);

    }

} // end function wipe(amount, from)


function zoomin(amount, to) // this function is a photo effect
{
	
	if (amount == 0)
	{
		zwidth = document.getElementById('picture').width;
		zheight = document.getElementById('picture').height;
		//testing.innerHTML = zwidth+", "+zheight;
		// Calculate slope.
		// Steps will be 1 each unless width is bigger than height
		// or height is bigger than width.  If that is the case
		// then the step for the bigger dimension will be the slope (ex: zwidth / zheight)
		// the 2 and the *2 is to make each step twice as big
		zxstep = 3;
		zystep = 3;
		if (zwidth > zheight)
			zxstep = (zwidth / zheight)*3;
		if (zheight > zwidth)
			zystep = (zheight / zwidth)*3;
	} 
	
	zwidth = zwidth + zxstep;
	zheight = zheight + zystep;
	
	//document.getElementById('testing').innerHTML = "xstep="+zxstep+", ystep="+zystep;
	

	document.getElementById('picture').width = zwidth;
	document.getElementById('picture').height = zheight;
	
	
	
	zzleft = parseFloat(document.getElementById('picture').style.left);
	zztop = parseFloat(document.getElementById('picture').style.top);
	
	//document.getElementById('testing').innerHTML = "left="+zleft+", top="+ztop;
	
	// Untouched is upperleft
	
	if (to == "upperright" || to == "right" || to == "lowerright")
		document.getElementById('picture').style.left = zzleft - zxstep + 'px';
	
	if (to == "top" || to == "bottom" || to == "center")
		document.getElementById('picture').style.left = zzleft - zxstep/2 + 'px';
	
	if (to == "lowerleft" || to == "bottom" || to == "lowerright")	
		document.getElementById('picture').style.top = zztop - zystep + 'px';
			
	if (to == "left" || to == "center" || to == "right")
		document.getElementById('picture').style.top = zztop - zystep/2 + 'px';
		
	amount++;
	
	//if (amount == 30) alert('hi');
	
	if (amount <= effect_amount)
		ztimer = window.setTimeout("zoomin("+amount+", '"+to+"');", effect_time);
	else
	{
		// reset left and top of picture
			//document.getElementById('picture').style.left = 0 + 'px';
			//document.getElementById('picture').style.top = 0 + 'px';
	}
	
} // end function zoomin(amount, to)



function effectsetup()
{
	
	//testing.innerHTML = document.getElementById('picture2').width+", "+
	//	document.getElementById('picture2').height;
	//testing.innerHTML += ". "+pictures[cur_pic].photo.width+", "+pictures[cur_pic].photo.height;
	
	ftype = pictures[cur_pic].effect.replace(/['">);']/gi, ""); // ex: slide(left
	foption = ftype.split('(0, '); // ex: slide     /    left
	
	if (foption[1])
		to = foption[1];
	else
		to = "";
	
	
	if (foption[0] == "zoomout")
	{
		document.getElementById('picture2').width = parseFloat(document.getElementById('picture2').width*2);
		document.getElementById('picture2').height = parseFloat(document.getElementById('picture2').height*2);
	
		// center enlarged image
		cwidth = parseFloat(document.getElementById('picture2').width*2);
		cheight = parseFloat(document.getElementById('picture2').height*2);
		ztop = 0;
		zleft = 0;
		
		// no to is upperleft
		
		if (to == "upperright" || to == "right" || to == "lowerright")
			zleft = (cwidth/4) * -1; // to get negative of the positive number
		
		if (to == "top" || to == "bottom" || to == "center")
			zleft = (cwidth/8) * -1;	
		
		if (to == "lowerleft" || to == "bottom" || to == "lowerright")
			ztop = (cheight/4) * -1;
		
		if (to == "left" || to == "center" || to == "right")	
			ztop = (cheight/8) * -1; 
			
			
		cleft = cleft + zleft;
		ctop = ctop + ztop;

		
		document.getElementById('picture2').style.top = ctop + 'px';
		document.getElementById('picture2').style.left = cleft + 'px';
		
		ztop = ctop;
		zleft = cleft;
		
	} // end if zoomout
	
	if (foption[0] == "pan")
	{
		document.getElementById('picture2').width = parseFloat(document.getElementById('picture2').width*pan_zoom);
		document.getElementById('picture2').height = parseFloat(document.getElementById('picture2').height*pan_zoom);
	
		// center enlarged image
		cwidth = parseFloat(document.getElementById('picture2').width*pan_zoom);
		cheight = parseFloat(document.getElementById('picture2').height*pan_zoom);
		ztop = 0;
		zleft = 0;

		// no to is upperleft
		
		if (to == "upperright" || to == "right" || to == "lowerright")
			zleft = (cwidth/4) * -1; // to get negative of the positive number
		
		if (to == "top" || to == "bottom" || to == "center")
			zleft = (cwidth/8) * -1;	
		
		if (to == "lowerleft" || to == "bottom" || to == "lowerright")
			ztop = (cheight/4) * -1;
		
		if (to == "left" || to == "center" || to == "right")	
			ztop = (cheight/8) * -1; 
			
			
		cleft = cleft + zleft;
		ctop = ctop + ztop;
		
		document.getElementById('picture2').style.top = ctop + 'px';
		document.getElementById('picture2').style.left = cleft + 'px';
		
		ztop = ctop;
		zleft = cleft;
		
	} // end if pan
	

} // end function effectsetup()


function zoomout(amount, to) // this function is a photo effect
{
		
	if (amount == 0)
	{
		//zwidth = document.getElementById('picture').width;
		//zheight = document.getElementById('picture').height;
		//zwidth = pictures[cur_pic].photo.width*2;
		//zheight = pictures[cur_pic].photo.height*2;
		
		// center enlarged image
		zwidth = parseFloat(document.getElementById('picture').width*2);
		zheight = parseFloat(document.getElementById('picture').height*2);

		
		//zleft = (phwidth - zwidth) / 2;
		//document.getElementById('picture').style.left = zleft;
		
		/*
		//if (to == "upperright" || to == "right" || to == "lowerright")
			zleft = (zwidth/2) * -1; // to get negative of the positive number
		
		if (to == "top" || to == "bottom" || to == "center")
			zleft = (zwidth/4) * -1;	
		
		//if (to == "lowerleft" || to == "bottom" || to == "lowerright")
			ztop = (zheight/2) * -1;
		
		if (to == "left" || to == "center" || to == "right")	
			ztop = (zheight/4) * -1;
		*/
	
		document.getElementById('picture').style.top = ztop + 'px';
		document.getElementById('picture').style.left = zleft + 'px'; 
		//ztop = ctop;
		//zleft = cleft;
		
		//	testingbox.innerHTML = zwidth+', '+zheight+", "+to;
		//document.getElementById('testing').innerHTML = "width="+zwidth+", height="+zheight;
		// Calculate slope.
		// Steps will be 3 each unless width is bigger than height
		// or height is bigger than width.  If that is the case
		// then the step for the bigger dimension will be the slope (ex: zwidth / zheight)*3
		// the 3 and the *3 is to make each step twice as big
		zxstep = 3;
		zystep = 3;
		if (zwidth > zheight)
			zxstep = (zwidth / zheight)*3;
		if (zheight > zwidth)
			zystep = (zheight / zwidth)*3;	
		//document.getElementById('picture').width = zwidth*2;
		//document.getElementById('picture').height = zheight*2;	
	} 
	
	zwidth = zwidth - zxstep;
	zheight = zheight - zystep;
	

	document.getElementById('picture').width = zwidth;
	document.getElementById('picture').height = zheight;

	zzleft = parseFloat(document.getElementById('picture').style.left);
	zztop = parseFloat(document.getElementById('picture').style.top);
	//testingbox.innerHTML = zzleft+', '+zztop;
	
	// Untouched is upperleft
	
	if (to == "upperright" || to == "right" || to == "lowerright")
		document.getElementById('picture').style.left = zzleft + zxstep + 'px';
	
	if (to == "top" || to == "bottom" || to == "center")
		document.getElementById('picture').style.left = zzleft + zxstep/2 + 'px';
	
	if (to == "lowerleft" || to == "bottom" || to == "lowerright")	
		document.getElementById('picture').style.top = zztop + zystep + 'px';
			
	if (to == "left" || to == "center" || to == "right")
		document.getElementById('picture').style.top = zztop + zystep/2 + 'px';
		
	amount++;
	
	
	//if (amount == 30) alert('hi');
	
	if (amount <= effect_amount)
		ztimer = window.setTimeout("zoomout("+amount+", '"+to+"');", effect_time);
	else
	{
		
		// reset left and top of picture
		//document.getElementById('picture').style.left = 0;
		//document.getElementById('picture').style.top = 0;
		//center_image('picture');
	}
	
} // end function zoomout(amount, to)


function pan(amount, to) // This is a photo effect
{
	if (amount == 0)
	{
		//zwidth = document.getElementById('picture').width;
		//zheight = document.getElementById('picture').height;
		//zwidth = pictures[cur_pic].photo.width*2;
		//zheight = pictures[cur_pic].photo.height*2;
		
		// center enlarged image
		zwidth = parseFloat(document.getElementById('picture').width*pan_zoom);
		zheight = parseFloat(document.getElementById('picture').height*pan_zoom);
		document.getElementById('picture').width = zwidth;
		document.getElementById('picture').height = zheight;
		
		//zleft = (phwidth - zwidth) / 2;
		//document.getElementById('picture').style.left = zleft;
		
		/*
		//if (to == "upperright" || to == "right" || to == "lowerright")
			zleft = (zwidth/2) * -1; // to get negative of the positive number
		
		if (to == "top" || to == "bottom" || to == "center")
			zleft = (zwidth/4) * -1;	
		
		//if (to == "lowerleft" || to == "bottom" || to == "lowerright")
			ztop = (zheight/2) * -1;
		
		if (to == "left" || to == "center" || to == "right")	
			ztop = (zheight/4) * -1;
		*/
	
		document.getElementById('picture').style.top = ztop + 'px';
		document.getElementById('picture').style.left = zleft + 'px'; 
		//ztop = ctop;
		//zleft = cleft;
		
			//testingbox.innerHTML = zwidth+', '+zheight+", "+to;
		//document.getElementById('testing').innerHTML = "width="+zwidth+", height="+zheight;
		// Calculate slope.
		// Steps will be 3 each unless width is bigger than height
		// or height is bigger than width.  If that is the case
		// then the step for the bigger dimension will be the slope (ex: zwidth / zheight)*3
		// the 2 and the *2 is to make each step twice as big
		zxstep = 1;
		zystep = 1;
		if (zwidth > zheight)
			zxstep = (zwidth / zheight);
		if (zheight > zwidth)
			zystep = (zheight / zwidth);	
		//document.getElementById('picture').width = zwidth*2;
		//document.getElementById('picture').height = zheight*2;	
	} 
	
	/*zwidth = zwidth - zxstep;
	zheight = zheight - zystep;
	 */

	zzleft = parseFloat(document.getElementById('picture').style.left);
	zztop = parseFloat(document.getElementById('picture').style.top);
	//testingbox.innerHTML = zzleft+', '+zztop;
	
	// There is no center in pan
	
	if (to == "upperright" || to == "right" || to == "lowerright")
		document.getElementById('picture').style.left = zzleft + zxstep + 'px';
	
	if (to == "upperleft" || to == "left" || to == "lowerleft")
		document.getElementById('picture').style.left = zzleft - zxstep + 'px';
	
	if (to == "lowerleft" || to == "bottom" || to == "lowerright")	
		document.getElementById('picture').style.top = zztop + zystep + 'px';
			
	if (to == "upperleft" || to == "top" || to == "upperright")
		document.getElementById('picture').style.top = zztop - zystep + 'px';
		
	amount++;
	
	
	//if (amount == 30) alert('hi');
	
	if (amount <= effect_amount)
		ztimer = window.setTimeout("pan("+amount+", '"+to+"');", effect_time);

} // end function pan(amount, from)


function zoom(amount, from) // This function is a transition
{

	pcomplete = document.getElementById('picture2').complete;
	// i need the if statement below for mozilla firefox
	// browsers and netscape browsers.  They don't know
	// the width of the height of an image until it 
	// completes loading, so I can't zoom in at the
	// correct size.  (It sets size to 24x24).  So I use
	// the .complete element to see if the photo has loaded.
	if (!pcomplete) // if photo hasn't finished loading
	{
		// call this function again in 100ms
		// to see if the photo completes loading
		setTimeout('zoom(0,"'+from+'")', 100);
		return; // exit this function
	}
	
	if (amount == 0)
	{
		pwidth = document.getElementById('picture2').width;
		pheight = document.getElementById('picture2').height;
		//pwidth = pictures[cur_pic].photo.width;
		//pheight = pictures[cur_pic].photo.height;
		set_opacity('picture2', 100);
	}	
	
	//document.getElementById('testing').innerHTML = "width="+pwidth+", height="+pheight;
	
	xstep = pwidth / trans_amount * amount;
	ystep = pheight / trans_amount * amount;
 		

	document.getElementById('picture2').width = xstep;
	document.getElementById('picture2').height = ystep;

	// uppperleft is not moving the top or left at all
	
	if (from == "left" || from == "center" || from == "right")
		document.getElementById('picture2').style.top = (pheight+ctop) / 2 - (ystep-ctop) / 2 + 'px';
	
	if (from == "top" || from == "center" || from =="bottom")
		document.getElementById('picture2').style.left = (pwidth+cleft) / 2 - (xstep-cleft) / 2 + 'px';
	
	if (from == "lowerleft" || from == "lowerright" || from=="bottom")
		document.getElementById('picture2').style.top = (pheight+ctop) - ystep + 'px';
		
	if (from == "upperright" || from == "lowerright" || from=="right")
		document.getElementById('picture2').style.left = (pwidth+cleft) - xstep + 'px';
		
	amount++;
	
	if (amount <= trans_amount)
		window.setTimeout("zoom("+amount+", '"+from+"');", trans_time);
	else
    {

		// I had to put half the seconds here and load the image
    	// early in order to prevent a flicker in IE when
    	// on a web server
		//center_image('picture');
		//document.getElementById('picture').src = pictures[cur_pic].photo.src;
		setTimeout('changepic();', trans_time);

    }
	
} // end function zoom(amount, from)


function slide(amount, from)
{
	pwidth = document.getElementById('picture2').width;
	pheight = document.getElementById('picture2').height;
	

	if (from == null || from == 'undefined')
		from = 'left';
	
	//document.getElementById('testing').innerHTML = "Hi "+amount+", "+from;
	
	if (from == "left" || from == "lowerleft" || from == "upperleft")
	{
		xstep = Math.round((pwidth+cleft) / trans_amount * amount);
		xstep = pwidth - (pwidth*2) + xstep;
		//document.getElementById('testing').innerHTML = xstep;
		document.getElementById('picture2').style.left = xstep + 'px';
	}
	else if (from == "right" || from == "lowerright" || from == "upperright")
	{
		xstep = Math.round((pwidth-cleft) / trans_amount * amount);
		xstep = pwidth - xstep;
		//document.getElementById('testing').innerHTML = xstep;
		document.getElementById('picture2').style.left = xstep + 'px';
	}
	
	if (from == "top" || from == "upperleft" || from == "upperright")
	{
		ystep = Math.round((pheight+ctop) / trans_amount * amount);
		ystep = pheight - (pheight*2) + ystep;
		//document.getElementById('testing').innerHTML = ystep;
		document.getElementById('picture2').style.top = ystep + 'px';
	}
	else if (from == "bottom" || from == "lowerleft" || from == "lowerright")
	{
		ystep = Math.round((pheight-ctop) / trans_amount * amount);
		ystep = pheight - ystep;
		//document.getElementById('testing').innerHTML = ystep;
		document.getElementById('picture2').style.top = ystep + 'px';
	}
	
	if (amount == 0)
		set_opacity('picture2', 100);
	
	amount++;
	
	if (amount <= trans_amount)
		window.setTimeout("slide("+amount+", '"+from+"');", trans_time);
	else
    {
		// I had to put half the seconds here and load the image
    	// early in order to prevent a flicker in IE when
    	// on a web server
		//document.getElementById('picture').src = pictures[cur_pic].photo.src;
		setTimeout('changepic();', trans_time);

    }	

}  // end function slide(0, from)


function change_url()
{
	/* set onclick of img to url 'where' */
	/* Added 7/26/10 */
	if (cur_pic == 0)
		pic_num = pictures.length - 1;
	else
		pic_num = cur_pic - 1;
	if (pictures[pic_num].url != '')
		window.location=pictures[pic_num].url;
} // end function change_url(where)

function changepic()
{
	
	var pictures_length = pictures.length;
	
	if (testing_mode == 1)
	testingbox.innerHTML = cur_pic+". Transition: "+pictures[cur_pic].trans+". Effect: "+pictures[cur_pic].effect+
	". Time: "+pictures[cur_pic].time;
	". Width:"+document.getElementById('picture').width+", "+document.getElementById('picture').height;
	
	var milliseconds = pictures[cur_pic].time;

	if (display_caption == 1) // display Picasa Description for current photo
		document.getElementById('captionholder').innerHTML = pictures[cur_pic].caption;
		
	clearTimeout(ztimer);
	
		
	document.getElementById('picture').src = pictures[cur_pic].photo.src;
		document.getElementById('picture').width = pictures[cur_pic].photo.width;
			document.getElementById('picture').height = pictures[cur_pic].photo.height;
				document.getElementById('picture').style.left = 0 + 'px';
					document.getElementById('picture').style.top = 0 + 'px';
	
	// 7/26/10 
	document.getElementById('pictureholder').title = pictures[cur_pic].url; 

				
	center_image('picture');
	
	if (testing_mode == 1)
	testingbox.innerHTML += ". Width:"+document.getElementById('picture').width+
							", "+document.getElementById('picture').height;
	
	// make sure picture is 100% opaque
	setTimeout("set_opacity('picture',100);", opacity_time)  // this is what causes the flicker in IE

	// set opacity of picture2 to invisible
	setTimeout("set_opacity('picture2',0);", opacity_time)  // this is what causes the flicker in IE
	
	// Call effect function
	//testing.innerHTML = eval('(typeof('+pictures[cur_pic].effect+'));'); // != "undefined");');
	eval(pictures[cur_pic].effect);
	
	if (testing_mode == 1) // 7/26/10
		testingbox.innerHTML += ". url="+pictures[cur_pic].url;
	
	cur_pic++;  // advance to next picture		
	
	if (cur_pic == pictures_length)
	{
		cur_pic = 0;
		if (randomize_photos == 1)
			shuffle_photos();	
		//setup_functions(); // to randomize the transitions and effects again
	}
	// preload next image
	//  if (cur_pic < pictures_length)
	//	img.src = pictures[cur_pic].photo;
	//else
	//	img.src = pictures[0]; 
		
	// I had to put a settimeout here and load the image
    // later in order to prevent a flicker of the next photo 
    // in IE and sometimes firefox
	// put next photo in IMG with ID 'picture2' but it will be invisible
	
	
	
	setTimeout("document.getElementById('picture2').src = pictures["+cur_pic+"].photo.src;", flicker_time);
	setTimeout("document.getElementById('picture2').width = pictures["+cur_pic+"].photo.width;", flicker_time+20);
	setTimeout("document.getElementById('picture2').height = pictures["+cur_pic+"].photo.height;", flicker_time+20);
	setTimeout("document.getElementById('picture2').style.left = 0 + 'px';", flicker_time+20);
	setTimeout("document.getElementById('picture2').style.top = 0 + 'px';", flicker_time+20);
	
	setTimeout('center_image("picture2");', flicker_time+50);
	
	// testing for zoomout(0)
	setTimeout('effectsetup();', flicker_time+100);
				
	// call transition function in duration 'seconds'
	setTimeout(pictures[cur_pic].trans, milliseconds);  
	//window.setTimeout("zoom(0);", seconds);
	//window.setTimeout("zoom(0, 'upperright');", seconds);
	//window.setTimeout("wipe(0, 'bottom');", seconds);


	//window.setTimeout("slide(0, 'top');", seconds);

}  // end function changepic(direction)

	// first create a testing div to write messages
	if (testing_mode == 1)
	{
		document.write('<div id="testing">testing Mode</div>');
		testingbox = document.getElementById('testing');
	}
	/* both fore and back pictures have to be positioned absolute */
	/* inside a relative div */
	/* Both have classes, 'pictureholder' and 'picture' respectively */
	/* so you can create these classes and add borders or whatever */
	/* We create the relative IMG's in loadpics */
	
	// So first we create the relative DIV
	document.write('<div id="pictureholder" class="pictureholder" onclick="change_url();"'+ // 7/26/10
		' style="width: '+phwidth+'px; height: '+phheight+'px; overflow: hidden; position: relative;">');
	// Close the pictureholder DIV
	document.write('</div>');
	// Make caption below pictureholder
	if (display_caption == 1)
	document.write('<div id="captionholder" class="captionholder"'+
		' style="width:'+phwidth+'px; height: '+caption_height+
		'px; border-width:'+caption_border+'px; border-style:solid;'+
		' margin-top: 5px; padding: 5px; text-align: center;"></div>');
	
// The line below starts the loadpics function
window.onload = loadpics; // get list of pics and put in pictures array
//loadpics();
